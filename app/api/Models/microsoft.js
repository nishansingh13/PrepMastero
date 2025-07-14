import mongoose from "mongoose";
const MicroSoftSchema = new mongoose.Schema({
    Difficulty :{
        type: String,
        required: true
    },
    Title :{
        type: String,
        required: true  
    }
    ,
    Link:{
        type: String,
        required: true
    }
    ,
    Topics : {
        type: String,
        required: true
    }
    ,
    status :{
        type: String,
        required: true
    }
    ,
    solved :{
        type: Boolean,
        required: true,
        default: false
    }
})
// overwrite model error if it already exists
// it will make microsofts because of mongoose pluralization if we need to do microsoft

export default mongoose.models.microsoft || mongoose.model("microsoft", MicroSoftSchema);