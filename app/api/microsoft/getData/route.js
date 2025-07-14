import { connectDB } from "@/app/api/db/connectDB";
import { getMicroSoftQuestions } from "../../controllers/microsoftControllers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const data = await getMicroSoftQuestions();
        return NextResponse.json(
            { data },
            { status: 200} 
        );

    } catch (error) {
        console.error("Error in Microsoft getData API:", error);
        return NextResponse.json({
            status: "error",
            message: "Failed to fetch Microsoft questions",
            details: error.message
        }, { status: 500 });
    }
}
