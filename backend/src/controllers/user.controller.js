import * as jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    secure: true
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
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "User fetched successfully"));
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {username, email} = req.body;

  if(!username && !email){
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        email
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
  const followers = await User.aggregate([
    {
      $match: {
        username
      }
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "user",
        as: "followers"
      }
    },
    {
      $project: {
        followers: 1,
        _id: 0
      }
    }
  ]);
  const following = await User.aggregate([
    {
      $match: {
        username
      }
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "follower",
        as: "following"
      }
    },
    {
      $project: {
        following: 1,
        _id: 0
      }
    }
  ]);
  const posts = await User.aggregate([
    {
      $match: {
        username
      }
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "owner",
        as: "posts"
      }
    },
    {
      $project: {
        posts: 1,
        _id: 0
      }
    }
  ]);
  const followersCount = followers[0]?.followers?.length || 0;
  const followingCount = following[0]?.following?.length || 0;
  const postsCount = posts[0]?.posts?.length || 0;

  const user = await User.findOne({username}).select("-password -refreshToken -lastLogin -preferences");
  return res
  .status(200)
  .json(new ApiResponse(200, {user, followersCount, followingCount, postsCount}, "User profile fetched successfully"));
  
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

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateProfilePicture, getUserProfile, addPersonalDetails };