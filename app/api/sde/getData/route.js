import { connectDB } from "@/app/api/db/connectDB";
import sde from "@/app/api/Models/sde";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        
        const sdeQuestions = await sde.find({});
        
        return NextResponse.json({
            message: "SDE questions fetched successfully",
            data: sdeQuestions
        });
        
    } catch (error) {
        console.error("Error fetching SDE questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch SDE questions" },
            { status: 500 }
        );
    }
}
