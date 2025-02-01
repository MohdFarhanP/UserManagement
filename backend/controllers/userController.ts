import { Request, Response } from "express"
import User from '../models/User.js'
import bcrypt from 'bcrypt';
import generateTocken from "../utils/generateTocken.js";
import { userType } from "../models/User.js";


export interface AuthRequest extends Request {
    user?: userType;
}




export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { userName, email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400).json({ message: 'user already exist' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword
        });
        console.log('user ', user._id)
        if (user) {
            res.status(201).json({
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                token: generateTocken(user._id, user.isAdmin),
                message: 'user created successfully'
            });

        } else {
            res.status(400).json({ message: 'invalid user data' });
        }

    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                userName: user.userName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateTocken(user._id, user.isAdmin)
            });
        } else {
            res.status(401).json({ message: 'invalid userName or password' })
        }
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                userName: req.user?.userName,
                email: req.user?.email,
                profileImage: req.user?.profileImage,
                message: 'welcome to your home page!',
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error', error });
    }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;

        if (!req.file || !req.file.path) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const profileImageUrl = req.file.path;


        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: profileImageUrl },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "Profile image updated successfully",
            profileImage: profileImageUrl,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}