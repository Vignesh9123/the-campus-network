import {Post} from '../models/post.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { postKeywords } from '../constants.js';
import * as mongoose from 'mongoose';

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
    const post = await Post.
    aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy"
            }
        },
        {
            $unwind: "$createdBy"
        },
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                tags: 1,
                public: 1,
                onlyFollowers: 1,
                createdAt: 1,
                createdBy: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    profilePicture: 1
                },
                likes:1,
                comments:1
                
            
            }
        }
    ]);
    if(!post){
        throw new ApiError(404, "Post not found");
    }
    //return the response
    return res.status(200).json(new ApiResponse(200, post[0], "Post fetched successfully"));
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
const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;
  
    // Ensure the username is provided
    if (!username?.trim()) {
      throw new ApiError(400, "Username is required");
    }
  
    // Find the user by their username
    const user = await User.findOne({ username }).select("_id");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Aggregate posts created by or reposted by the user
    const posts = await Post.aggregate([
      {
        $match: {
          $or: [
            { createdBy: user._id },  // Original posts
            // { repostedBy: user._id }, // Reposts
          ]
        }
      },
      {
        $lookup: {
          from: "posts",              // Join with the same Post collection
          localField: "repostedFrom", // Use repostedFrom as the join key
          foreignField: "_id",        // Match the _id of the original post
          as: "repostedPost",         // Alias the result as repostedPost
        }
      },
      { $unwind: { path: "$repostedPost", preserveNullAndEmptyArrays: true } }, // Unwind to make repostedPost a single object
      {
        $lookup: {
          from: "users",               // Join with User collection for post creators
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy"
        }
      },
      { $unwind: "$createdBy" },       // Unwind createdBy to make it a single object
      {
        $lookup: {
          from: "users",               // Join with User collection for the reposted post's creator
          localField: "repostedPost.createdBy",
          foreignField: "_id",
          as: "repostedPost.createdBy"
        }
      },
      { $unwind: { path: "$repostedPost.createdBy", preserveNullAndEmptyArrays: true } }, // Unwind repostedPost's createdBy
      {
        $project: {
          // Project only the necessary fields
          title: 1,
          content: 1,
          createdAt: 1,
          createdBy: { _id: 1, username: 1, email: 1, profilePicture: 1 }, // Original post creator
          repostedPost: {
            _id: 1,
            title: 1,
            content: 1,
            createdBy: { _id: 1, username: 1, email: 1, profilePicture: 1 }, // Reposted post creator
            createdAt: 1,
            likes: 1,
            comments: 1,
            repostedBy:1
          },
          isRepost: 1,
          repostedFrom: 1, // Optionally include repostedFrom ID
          comments: 1,
          likes: 1,
          tags: 1,
          public: 1,
          repostedBy:1
        }
      },
      { $sort: { createdAt: -1 } } // Sort by creation date (newest first)
    ]);
  
    return res
      .status(200)
      .json(new ApiResponse(200, posts, "User posts fetched successfully"));
  });
  
  


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
    })
    .sort({createdAt: -1});
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

const createRePost = asyncHandler(async (req, res) => {
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

    if(post.repostedBy.includes(req.user._id)){
        // throw new ApiError(400, "You have already re-posted this post");
        
        const repostedPost = await Post.find({isRepost: true, repostedFrom: postId, createdBy: req.user._id});
        await post.updateOne({$pull: {repostedBy: req.user._id}});
        await Post.deleteMany({isRepost: true, repostedFrom: postId, createdBy: req.user._id});
        await User.updateOne({_id: req.user._id}, {$pull: {posts: repostedPost[0]._id}});
        post.repostedBy = post.repostedBy.filter((id) => id.toString() !== req.user._id.toString());
        const repostLength = post.repostedBy.length;
        return res.status(200).json(new ApiResponse(200, {repostLength}, "Re-post removed successfully"));
    }
    //create a new post
    const rePost = await Post.create({
        isRepost: true,
        repostedFrom: postId,
        createdBy: req.user._id
    });
    if(!rePost){
        throw new ApiError(500, "Something went wrong while creating the re-post");
    }
    //add the post to the user's posts array
    const user = await User.findById(req.user._id);
    user.posts.push(rePost._id);
    await user.save({validateBeforeSave:false});

    post.repostedBy.push(req.user._id);
    const repostLength = post.repostedBy.length;
    await post.save({validateBeforeSave:false});

    //return the response
    return res.status(200).json(new ApiResponse(200, {rePost, repostLength}, "Re-post created successfully"));

})


const getLikedUsers = asyncHandler(async (req, res) => {
    const {postId} = req.params;
    if(!postId){
        throw new ApiError(400, "Post id is required");
    }
    const likedUsers = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $project: {
                likes: 1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "likes",
                foreignField: "_id",
                as: "likedUsers"
            }
        },
        {
            $unwind: "$likedUsers"
        },
        {
            $project: {
                _id: 1,
                likedUsers: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    profilePicture: 1
                }
            }
        }
    ]);
    return res.status(200).json(new ApiResponse(200, likedUsers, "Liked users fetched successfully"));
})

export {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getUserPosts,
    searchPosts,
    likeorUnlikePost,
    createRePost,
    getLikedUsers
}