import { Router } from "express";
import {
    getUserAndUnreadMessages,
    getMessages,
    markMessageAsSeen,
    sendMessage,
} from "../controllers/message.controllers.js";
import { protectRoute } from "../middlewares/authentication.js";
import { upload } from '../middlewares/multer.js'

const router = Router()

router.get('/users', protectRoute, getUserAndUnreadMessages)
router.get('/:id', protectRoute, getMessages)
router.put('/mark/:id', protectRoute, markMessageAsSeen)
router.post('/send/:id', upload.single('image'), protectRoute, sendMessage)

export default router