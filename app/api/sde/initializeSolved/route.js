import { connectDB } from "@/app/api/db/connectDB";
import sde from "@/app/api/Models/sde";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB();
        
        // Update all documents that don't have a 'solved' field or have it as null/undefined
        const result = await sde.updateMany(
            { 
                $or: [
                    { solved: { $exists: false } },
                    { solved: null },
                    { solved: undefined }
                ]
            },
            { $set: { solved: false } }
        );
        
        console.log(`Updated ${result.modifiedCount} SDE documents with solved: false`);
        
        // Get sample of updated documents
        const sampleDocs = await sde.find({}).limit(5);
        
        return NextResponse.json({
            message: "SDE solved field initialized successfully",
            modifiedCount: result.modifiedCount,
            sampleDocs: sampleDocs.map(doc => ({
                name: doc.Name,
                solved: doc.solved,
                solvedType: typeof doc.solved
            }))
        });
        
    } catch (error) {
        console.error("Error initializing SDE solved field:", error);
        return NextResponse.json(
            { error: "Failed to initialize SDE solved field" },
            { status: 500 }
        );
    }
}
