import mongoose from "mongoose";

const RemoteJobSchema = new mongoose.Schema({
    remoteId: {
        type: Number,
        required: true,
        unique: true,
    },
    title: String,
    url: String,
    company_name: String,
    salary: String,
    job_type: String,
    description: String,
}, {timestamps: true}); //RemoteJobSchema



export default mongoose.model("RemoteJob", RemoteJobSchema);