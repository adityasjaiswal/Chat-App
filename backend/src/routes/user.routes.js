import { Router } from 'express'
import { 
    registerUser,
    login,
    updateProfile,
    getCurrentUser,
    logout,
    blockUser,
    unBlockUser,
    addToWhiteList,
} from '../controllers/user.controllers.js'
import { protectRoute } from '../middlewares/authentication.js'
import { upload } from '../middlewares/multer.js'


const router = Router()

router.post('/register', upload.none(), registerUser)
router.post('/login', upload.none(), login)
router.put('/update-profile',upload.single('avatar'), protectRoute, updateProfile)
router.get('/check', protectRoute, getCurrentUser)
router.put('/logout', protectRoute, logout)
router.put('/block/:id', protectRoute, blockUser)
router.put('/unblock/:id', protectRoute, unBlockUser)
router.put('/addToSidebar/:id', protectRoute, addToWhiteList)

export default router