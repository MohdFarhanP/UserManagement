import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getUsers, updateUser, createUser, deleteUser } from '../controllers/adminController.js';


const router = express.Router();

//admin routes
router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.patch("/users/:id", protect, adminOnly, updateUser);
router.post("/createUser", protect, adminOnly, createUser);

export default router;