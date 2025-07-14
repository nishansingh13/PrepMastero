import { connectDB } from "@/app/api/db/connectDB";
import microsoft from "@/app/api/Models/microsoft";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB();
        
        // Update all documents that don't have a 'solved' field or have it as null/undefined
        const result = await microsoft.updateMany(
            { 
                $or: [
                    { solved: { $exists: false } },
                    { solved: null },
                    { solved: undefined }
                ]
            },
            { $set: { solved: false } }
        );
        
        console.log(`Updated ${result.modifiedCount} documents with solved: false`);
        
        // Get sample of updated documents
        const sampleDocs = await microsoft.find({}).limit(5);
        
        return NextResponse.json({
            message: "Solved field initialized successfully",
            modifiedCount: result.modifiedCount,
            sampleDocs: sampleDocs.map(doc => ({
                title: doc.Title,
                solved: doc.solved,
                solvedType: typeof doc.solved
            }))
        });
        
    } catch (error) {
        console.error("Error initializing solved field:", error);
        return NextResponse.json(
            { error: "Failed to initialize solved field" },
            { status: 500 }
        );
    }
}
