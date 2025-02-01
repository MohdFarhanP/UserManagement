import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
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
}, {
    timestamps: true,
});
const User = mongoose.model('User', userSchema);
export default User;
