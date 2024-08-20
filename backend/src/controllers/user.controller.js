import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

export { registerUser };