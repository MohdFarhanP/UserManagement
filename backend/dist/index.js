import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
connectDB();
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});
