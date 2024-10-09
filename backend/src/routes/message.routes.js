import {Router} from 'express'
import {
    sendMessage
    
} from '../controllers/message.contoller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
const router = Router()

router.use(verifyJWT)

router.route('/send-message/:chatId').post(sendMessage)
export default router