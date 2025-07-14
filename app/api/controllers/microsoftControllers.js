import { NextResponse } from "next/server";
import { connectDB } from "../db/connectDB"
import microsoft from "../Models/microsoft";

export const getMicroSoftQuestions = async () => {
    try {
        await connectDB();
        const data = await microsoft.find({});
        return data; 
    } catch (err) {
        console.error("Error fetching Microsoft questions:", err);
        throw err;
    }
};
