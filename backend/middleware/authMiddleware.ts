import { Request, Response, NextFunction } from 'express'
import User, { userType } from '../models/User.js'
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../controllers/userController.js'



export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log()
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

            const user = await User.findById(decoded.id).select('-password').lean();

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            req.user = user as userType;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


// Admin middleware
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    next();
};