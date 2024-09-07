import * as jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendMail.js";
import { Post } from '../models/post.model.js';
const generateAccesAndRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend(request)

  const {username, email, password} = req.body;
  
  // Validate the user details

  if([username, email, password].some((field) => field?.trim() === "")){
    throw new ApiError(400, "All fields are required");
  }
  const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_@]*$/;
  if(!usernameRegex.test(username)){
    throw new ApiError(400, "Invalid username");
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if(!emailRegex.test(email)){
    throw new ApiError(400, "Invalid email");
  }
  if(password.length < 6){
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Check if user already exists using username and password

  const existedUser = await User.findOne({
    $or: [{username}, {email}]
  })
  if(existedUser){
    throw new ApiError(400, "User already exists, please login");
  } // redirect to login
  
  // check for profile pic and upload to cloudinary
  // console.log("req.files: ",req.files?.profilePicture[0]?.path);
  let pfpLocalPath;
  let profilePicture; 
  if(req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0){
    pfpLocalPath = req.files.profilePicture[0].path;
  }
  // console.log("pfpfLocalPath: ", pfpfLocalPath);
  if(!pfpLocalPath){
    // // set default profile picture
    // console.log("default profile picture");
    // const defaultProfilePicture = {
    //   name: "default-profile-picture",
    //   url: process.env.DEFAULT_USER_IMAGE_URL
    // }
  }
  else{
  profilePicture = await uploadOnCloudinary(pfpLocalPath);
  if(!profilePicture){
    throw new ApiError(400, "Profile picture upload failed");
  }
}
const profilePictureURL = pfpLocalPath ? profilePicture.url : process.env.DEFAULT_USER_IMAGE_URL;

  // create user object - create entry in db
  
  const user = await User.create({
    username,
    email,
    password,
    profilePicture: profilePictureURL,
  })
  // remove password and refresh token field from response
  // check for user creation
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // Return the response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
});

const loginUser = asyncHandler(async (req, res) =>{
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, username, password} = req.body

  if (!username && !email) {
      throw new ApiError(400, "username or email is required")
  }
  
  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")
      
  // }

  const user = await User.findOne({
      $or: [{username}, {email}]
  })

  if (!user) {
      throw new ApiError(404, "User does not exist")
  }

 const isPasswordValid = await user.isPasswordCorrect(password)

 if (!isPasswordValid) {
  throw new ApiError(401, "Invalid user credentials")
  }

 const {accessToken, refreshToken} = await generateAccesAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

})


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {refreshToken: undefined}
    },
    {
      new: true
    }
  )
  const options = {
    httpOnly: true,
    secure:  process.env.NODE_ENV === "production"
  }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if(!user){
      throw new ApiError(401, "Invalid refresh token");
    }
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const {accessToken, newRefreshToken} = await generateAccesAndRefreshToken(user._id);
    const options = {
      httpOnly: true,
      secure:process.env.NODE_ENV === "production"
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({validateBeforeSave: true});
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
  console.log(req.user)
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "User fetched successfully"));
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {username, email, bio} = req.body;

  if(!username && !email && !bio){
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        email,
        bio
      }
    },
    {new: true}
  ).select("-password");
  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"));
})

const updateProfilePicture = asyncHandler(async(req, res)=>{
  const profilePictureLocalPath = req.file?.path;
  if(!profilePictureLocalPath){
    throw new ApiError(400, "Profile picture is required");
  }
  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  if(!profilePicture.url){
    throw new ApiError(400, "Error while uploading profile picture");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePicture: profilePicture.url
      }
    },
    {new: true}
  ).select("-password");
  //TODO: Delete old profilePicture
  return res
  .status(200)
  .json(new ApiResponse(200, user, "Profile picture updated successfully"));
})

const getUserProfile = asyncHandler(async(req, res)=>{
  const {username} = req.params;
  if(!username?.trim()){
    throw new ApiError(400, "Username is required");
  }
  const followers =await User.findOne({username}).select("followers").populate({
    path: "followers",
    select: "username email profilePicture"
  });

  const following =await User.findOne({username}).select("following").populate({
    path: "following",
    select: "username email profilePicture"
  });
  const followersCount = followers?.followers?.length || 0;
  const followingCount = following?.following?.length || 0;
  const user = await User.findOne({username}).select("-password -refreshToken -lastLogin -preferences");
  return res
  .status(200)
  .json(new ApiResponse(200, {user, followersCount, followingCount}, "User profile fetched successfully"));
  
})

const getUserFollowers = asyncHandler(async(req, res)=>{
  const {username} = req.params;
  if(!username?.trim()){
    throw new ApiError(400, "Username is required");
  }
  const user = await User.findOne({username}).select("followers").populate({
    path: "followers",
    select: "username email profilePicture"
  });
  const followers = user?.followers || [];
  return res
  .status(200)
  .json(new ApiResponse(200, followers, "User followers fetched successfully"));
})
const getUserFollowing = asyncHandler(async(req, res)=>{
  const {username} = req.params;
  if(!username?.trim()){
    throw new ApiError(400, "Username is required");
  }
  const user = await User.findOne({username}).select("following").populate({
    path: "following",
    select: "username email profilePicture"
  });
  const following = user?.following || [];
  return res
  .status(200)
  .json(new ApiResponse(200, following, "User following fetched successfully"));
})


const addPersonalDetails = asyncHandler(async(req, res)=>{
    const { phone, engineeringDomain, college, yearOfGraduation } = req.body
    if(!phone || !engineeringDomain || !college || !yearOfGraduation){
        throw new ApiError(400, "Atleast one field is required");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                phone,
                engineeringDomain,
                college,
                yearOfGraduation
            }
        },
        {new: true}
    ).select("-password");
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Personal details updated successfully"));
})


const followOrUnfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  const currentUser = await User.findById(req.user._id);
  const userToFollow = await User.findById(userId);

  if (!userToFollow) {
    throw new ApiError(404, 'User not found');
  }

  if (currentUser.following.includes(userId)) {
    // Unfollow the user
    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== userId
    );
    userToFollow.followers = userToFollow.followers.filter(
      (followerId) => followerId.toString() !== req.user._id.toString()
    );
  } else {
    // Follow the user
    currentUser.following.push(userId);
    userToFollow.followers.push(req.user._id);
  }

  await currentUser.save({validateBeforeSave:false});
  await userToFollow.save({validateBeforeSave:false});

  res.status(200).json(
    new ApiResponse(200, {
      following: currentUser.following,
      followers: userToFollow.followers,
    }, 'Follow/Unfollow successful')
  );
});

const forgotPassword = asyncHandler(async(req, res)=>{
  const {email, username} = req.body;
  if(!email && !username){
    throw new ApiError(400, "Email or username is required");
  }
  const user = await User.findOne({
    $or: [{email}, {username}]
  });
  if(!user){
    throw new ApiError(404, "User not found");
  }
  const resetToken = await user.generatePasswordResetToken();
  user.passwordResetToken = resetToken;
  await user.save({validateBeforeSave: false});
  const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
  const message = `You have requested to reset your password. Please click on the link to reset your password: ${resetPasswordURL}. If you did not request this, please ignore this email.`;
  await sendEmail({
    email: user.email,
    subject: "Reset your password",
    message
  });
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password reset token sent to your email"));
})
const resetPassword = asyncHandler(async(req, res)=>{
  const {resetToken} = req.params;
  const {password} = req.body;
  console.log("reset:",resetToken, password);
  const user = await User.findOne({
    passwordResetToken: resetToken,
  });
  if(!user){
    throw new ApiError(400, "Token is invalid or expired");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password reset successful"));
})


const sendVerificationEmail = asyncHandler(async(req, res)=>{
  const user = await User.findById(req.user?._id);
  const token = user.generateEmailVerificationToken();
  const verificationURL = `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${token}`;
  const message = `Please click on the link to verify your email: ${verificationURL}`;
  await sendEmail({
    email: user.email,
    subject: "Verify your email",
    message
  });
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Verification email sent successfully"));
})

const verifyEmail = asyncHandler(async(req, res)=>{
  const {token} = req.params;
  const decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id);
  if(!user){
    throw new ApiError(400, "Invalid token");
  }
  user.isEmailVerified = true;
  await user.save({validateBeforeSave: true});
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Email verified successfully"));
})


const resendVerificationEmail = asyncHandler(async(req, res)=>{
  const user = await User.findById(req.user?._id);
  if(user.isEmailVerified){
    throw new ApiError(400, "Email is already verified");
  }
  await sendVerificationEmail(req, res);
})


const getUserFeed = asyncHandler(async(req, res)=>{
  const user = await User.findById(req.user?._id);
  const following = user.following;
  const feed = await Post.find({
    createdBy: {$in: following}
  }).populate({
    path: "crdeatedBy",
    select: "username email profilePicture"
  });
  return res
  .status(200)
  .json(new ApiResponse(200, feed, "User feed fetched successfully"));
})


const searchUsers = asyncHandler(async(req, res)=>{
  const {query} = req.query;
  if(!query){
    throw new ApiError(400, "Query is required");
  }
  const users = await User.find({
    $or: [
      {username: {$regex: query, $options: 'i'}},
      {email: {$regex: query, $options: 'i'}}
    ]
  }).select("username email profilePicture");
  return res
  .status(200)
  .json(new ApiResponse(200, users, "Users fetched successfully"));
})

const handleSocialLogin = asyncHandler(async(req, res)=>{
 const user = await User.findById(req.user?._id);
 if(!user){
  throw new ApiError(404, "User not found");
 }
 const {accessToken, refreshToken} = await generateAccesAndRefreshToken(user._id);
 const options = {
   httpOnly: true,
   secure:process.env.NODE_ENV === "production"
 }
 return res
 .status(201)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", refreshToken, options)
 .redirect(`${process.env.CLIENT_URL}/setLogin?access-token=${accessToken}&refresh-token=${refreshToken}`);

}
)

const isUsernameUnique = asyncHandler(async(req,res)=>{
  const {username} = req.query
  const user = await User.findOne({username});
  if(user){
    return res.status(200).json(new ApiResponse(200, {isUnique: false}, "Username already exists"))
  }
  res.status(200).json(new ApiResponse(200, {isUnique:true}, "Username is unique"));
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateProfilePicture, getUserProfile, addPersonalDetails , followOrUnfollowUser, forgotPassword, resetPassword, searchUsers, sendVerificationEmail, verifyEmail, resendVerificationEmail, getUserFeed, getUserFollowers, getUserFollowing, handleSocialLogin, isUsernameUnique};