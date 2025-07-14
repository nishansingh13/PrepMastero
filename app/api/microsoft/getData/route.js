import { getMicroSoftQuestions } from "../../controllers/microsoftControllers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await getMicroSoftQuestions();
       return NextResponse.json(
            { data },
            { status: 200} 
            );

    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: "Failed to fetch Microsoft questions"
        }, { status: 500 });
    }
}
