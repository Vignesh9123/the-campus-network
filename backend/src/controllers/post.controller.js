import {Post} from '../models/post.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.models.js';
//create a new post
const createPost = asyncHandler(async (req, res) => {
    const {title, content, tags, isPublic, onlyFollowers} = req.body;
    //validate the input fields
    if(!title || !content){
        throw new ApiError(400, "Title and content are required");
    }
    //create a new post
    const post = await Post.create({
        title,
        content,
        tags,
        public: isPublic,
        onlyFollowers,
        createdBy: req.user._id
    });

    if(!post){
        throw new ApiError(500, "Something went wrong while creating the post");
    }
    //add the post to the user's posts array
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save({validateBeforeSave:false});
    //return the response
    return res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
    
})

const getPost = asyncHandler(async (req, res) => {
    const {postId} = req.params;
    //validate the input fields
    if(!postId){
        throw new ApiError(400, "Post id is required");
    }
    //find the post
    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404, "Post not found");
    }
    //return the response
    return res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
})

const updatePost = asyncHandler(async (req, res) => {
    const {postId} = req.params;
    const {title, content, tags, isPublic, onlyFollowers} = req.body;
    //validate the input fields
    if(!postId){
        throw new ApiError(400, "Post id is required");
    }
    //find the post
    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404, "Post not found");
    }
    //update the post
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.public = isPublic || post.public;
    post.onlyFollowers = onlyFollowers || post.onlyFollowers;
    //save the post
    const updatedPost = await post.save();
    //return the response
    return res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
})
const getUserPosts = asyncHandler(async(req, res)=>{
    const {username} = req.params;
    if(!username?.trim()){
      throw new ApiError(400, "Username is required");
    }
    const user = await User.findOne({username}).select("_id");
    const posts = await Post.find({createdBy: user?._id}).populate({
      path: "createdBy",
      select: "username email profilePicture"
    });
    return res
    .status(200)
    .json(new ApiResponse(200, posts, "User posts fetched successfully"));
  })
  


const deletePost = asyncHandler(async (req, res) => {
    const {postId} = req.params;
    //validate the input fields
    if(!postId){
        throw new ApiError(400, "Post id is required");
    }
    //find the post
    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404, "Post not found");
    }
    //delete the post
    const deletedPost = await Post.findByIdAndDelete(postId);
    //return the response
    return res.status(200).json(new ApiResponse(200, deletedPost, "Post deleted successfully"));
})

export {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getUserPosts
    
}