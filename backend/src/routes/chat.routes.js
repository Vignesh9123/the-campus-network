import {Router} from 'express'
import {
    getChats,
    createOrGetOnetoOneChat
} from '../controllers/chat.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verifyJWT)

router.route('/').get(getChats)
router.route('/c1to1').post(createOrGetOnetoOneChat)
export default router