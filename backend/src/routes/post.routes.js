import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getPost, createPost, updatePost, deletePost,getUserPosts } from "../controllers/post.controller.js";

const router = Router()

router.route("/:postId").get(getPost)
router.route("/create").post(verifyJWT, createPost)
router.route("/update/:postId").post(verifyJWT, updatePost)
router.route("/delete/:postId").post(verifyJWT, deletePost)
router.route("/user/:username").get(getUserPosts)

export default router;