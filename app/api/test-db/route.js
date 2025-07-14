import { connectDB } from "@/app/api/db/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Testing database connection...");
        console.log("Environment variables:", {
            MONGO_URI: process.env.MONGO_URI ? "SET" : "NOT SET",
            MONGODB_URI: process.env.MONGODB_URI ? "SET" : "NOT SET"
        });
        
        await connectDB();
        
        return NextResponse.json({
            status: "success",
            message: "Database connection successful",
            connectionName: "Connected"
        });
        
    } catch (error) {
        console.error("Database connection test failed:", error);
        return NextResponse.json({
            status: "error",
            message: "Database connection failed",
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
