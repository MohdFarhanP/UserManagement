import mongoose, { Schema, Document, Model } from 'mongoose';

export interface userType extends Document {
    _id: mongoose.Types.ObjectId;
    userName: string;
    email: string;
    password: string;
    profileImage?: string;
    isAdmin?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema: Schema<userType> = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            default: '',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<userType> = mongoose.model<userType>('User', userSchema);
export default User;