import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateTocken = (id: string | mongoose.Types.ObjectId | undefined, isAdmin: boolean | undefined): string => {
    console.log(`id ${id}, role:${isAdmin}`)
    return jwt.sign({ id: id, role: isAdmin }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
}

export default generateTocken;