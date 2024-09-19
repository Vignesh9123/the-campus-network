import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import {Comment} from '../models/comment.model.js'
import { Post } from '../models/post.model.js'

const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const { comment } = req.body
    const userId = req.user._id

    if (!comment) {
        throw new ApiError(400, 'Content is required')
    }

    const post = await Post.findById(postId)
    if (!post) {
        throw new ApiError(404, 'Post not found')
    }

    const savedComment = await Comment.create({
        comment,
        post: postId,
        user: userId
    })

    res.status(201).json(new ApiResponse(201, savedComment, 'Comment added successfully'))
})
const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params

    const post = await Post.findById(postId)
    if (!post) {
        throw new ApiError(404, 'Post not found')
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                post: post._id
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                comment: 1,
                user: {
                    _id: 1,
                    username: 1,
                    profilePicture: 1,
                    email:1
                },
                createdAt: 1
            }
        },{

            $sort: {
                createdAt: -1
            }
        }
    ])

    

    res.status(200).json(new ApiResponse(200, comments, 'Comments fetched successfully'))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, 'Comment not found')
    }

    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to delete this comment')
    }

    await Comment.findByIdAndDelete(commentId)

    res.status(200).json(new ApiResponse(200, null, 'Comment deleted successfully'))
})



export {
    addComment,
    getCommentsByPost,
    deleteComment
}