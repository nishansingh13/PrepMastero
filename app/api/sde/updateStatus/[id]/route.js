import { connectDB } from "@/app/api/db/connectDB";
import sde from "@/app/api/Models/sde";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        await connectDB();
        
        const { id } = params;
        const body = await req.json();
        
        // Prepare update object
        const updateData = {};
        if (body.status !== undefined) {
            updateData.status = body.status;
        }
        if (body.solved !== undefined) {
            updateData.solved = body.solved;
        }
        
        // Update the problem
        const updatedProblem = await sde.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
        if (!updatedProblem) {
            return NextResponse.json(
                { error: "Problem not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            message: "Status updated successfully",
            problem: updatedProblem
        });
        
    } catch (error) {
        console.error("Error updating problem status:", error);
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 }
        );
    }
}
