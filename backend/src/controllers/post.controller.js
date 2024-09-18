import {Post} from '../models/post.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { postKeywords } from '../constants.js';

//create a new post
const createPost = asyncHandler(async (req, res) => {
    const {title, content, isPublic, onlyFollowers} = req.body;
    //validate the input fields
    if(!title || !content){
        throw new ApiError(400, "Title and content are required");
    }
    const contentWords = content.toLowerCase().split(/\W+/);
    const titleWords = title.toLowerCase().split(/\W+/);
    const unionWords = [...new Set([...contentWords, ...titleWords])];
    const tags = postKeywords.filter(keyword => unionWords.includes(keyword)); 
    tags.push(req.user.engineeringDomain)    
    tags.push(req.user.college)

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
    }).sort(
        {createdAt: -1}
    );
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

const searchPosts = asyncHandler(async (req, res) => {
    const {query} = req.query;
    //validate the input fields
    if(!query?.trim()){
        throw new ApiError(400, "Search query is required");
    }
    //find the posts
    const posts = await Post
    .find({
        $or: [
            {title: {$regex: query, $options: "i"}},
            {content: {$regex: query, $options: "i"}},
            {tags: {$regex: query, $options: "i"}}
        ],
        public: true,
        onlyFollowers: false
    })
    .populate({
        path: "createdBy",
        select: "username email profilePicture"
    });
    if(!posts){
        throw new ApiError(404, "No posts found");
    }
    const postsCount = posts.length;
    //return the response
    return res.status(200).json(new ApiResponse(200, {posts, postsCount}, "Posts fetched successfully"));
})

const likeorUnlikePost = asyncHandler(async (req, res) => {
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
    //check if userid is already present post.likes
    if(post.likes.includes(req.user._id)){
        //unlike the post
        post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    }
    else{
        //find user
        const user = await User.findById(req.user._id);
        if(!user){
            throw new ApiError(404, "User not found");
        }
        //update user prefs with post tags
        user.preferences = [...new Set([...user.preferences, ...post.tags])];
        await user.save({validateBeforeSave:false});
        //like the post
        post.likes.push(req.user._id);
    } 
    
    //save the post
    const updatedPost = await post.save();
    const updatedLikesCount = updatedPost.likes.length;
    //return the response
    return res.status(200).json(new ApiResponse(200, updatedLikesCount, "Post liked/disliked successfully"));
})

export {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getUserPosts,
    searchPosts,
    likeorUnlikePost
}