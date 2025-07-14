import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("Using existing connection");
        return;
    }
    
    if (!MONGO_URI) {
        console.error("MongoDB URI not found in environment variables");
        throw new Error("MongoDB URI not found in environment variables");
    }
    
    try {
        console.log("Connecting to MongoDB....");
        await mongoose.connect(MONGO_URI, {
            bufferCommands: false,
        });
        console.log("MongoDB Connected to:", mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};