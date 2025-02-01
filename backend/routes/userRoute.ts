import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getUserProfile, updateProfile } from '../controllers/userController.js';
import { upload } from '../config/multer.js'

const router = express.Router();

//user routes
router.post("/signup", registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.patch('/updateProfile', protect, upload.single("profileImage"), updateProfile);


export default router;  