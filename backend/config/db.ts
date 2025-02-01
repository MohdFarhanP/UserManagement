import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("connected", conn.connection.host)
    } catch (error) {
        console.log("mongodb connecting error", error);
    }
}

export default connectDB;