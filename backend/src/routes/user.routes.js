import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateProfilePicture, getUserProfile, addPersonalDetails, followOrUnfollowUser, forgotPassword,resetPassword, searchUsers, getUserFeed, getUserFollowers, getUserFollowing, } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendEmail } from "../utils/sendMail.js";
const router = Router()

router.route('/register').post(upload.fields([{
    name: "profilePicture",
    maxCount: 1
}])
    ,registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route('/current-user').get(verifyJWT, getCurrentUser)
router.route('/update-profile-picture').patch(verifyJWT, upload.single("profilePicture"), updateProfilePicture)
router.route('/u=:username').get(getUserProfile)
router.route('/add-personal-details').post(verifyJWT, addPersonalDetails)
router.route('/follow/:userId').post(verifyJWT, followOrUnfollowUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)
router.route('/search').get(searchUsers)
router.route('/feed').get(verifyJWT, getUserFeed)

export default router