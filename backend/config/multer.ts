import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './coludinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'profile_img',
            format: 'png',
            allowed_formats: ['jpg', 'png', 'jpeg'],
        };
    },
});


const upload = multer({ storage });

export { upload };