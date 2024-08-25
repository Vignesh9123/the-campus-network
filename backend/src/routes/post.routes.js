import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getPost, createPost, updatePost, deletePost,getUserPosts, searchPosts } from "../controllers/post.controller.js";

const router = Router()

router.route("/post/:postId").get(getPost)
router.route("/create").post(verifyJWT, createPost)
router.route("/update/:postId").post(verifyJWT, updatePost)
router.route("/delete/:postId").post(verifyJWT, deletePost)
router.route("/user/:username").get(getUserPosts)
router.route("/search").get(searchPosts) // api/v1/posts/search?query=something

export default router;