import { connectDB } from "@/app/api/db/connectDB";
import { getMicroSoftQuestions } from "../../controllers/microsoftControllers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Starting Microsoft getData API...");
        console.log("Environment check:", {
            MONGO_URI: process.env.MONGO_URI ? "SET" : "NOT SET",
            MONGODB_URI: process.env.MONGODB_URI ? "SET" : "NOT SET"
        });
        
        await connectDB();
        console.log("Database connected successfully");
        
        const data = await getMicroSoftQuestions();
        console.log("Data fetched successfully, count:", data?.length || 0);
        
        return NextResponse.json(
            { data },
            { status: 200} 
        );

    } catch (error) {
        console.error("Error in Microsoft getData API:", error);
        console.error("Error stack:", error.stack);
        
        return NextResponse.json({
            status: "error",
            message: "Failed to fetch Microsoft questions",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
