import mongoose from "mongoose";

const SDESchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Difficulty: {
        type: String,
        required: true
    },
    Link: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Not Solved"
    },
    solved: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Export the model with correct collection name
export default mongoose.models["sde-striver"] || mongoose.model("sde-striver", SDESchema);
