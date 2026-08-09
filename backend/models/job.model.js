import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        salary: {
            type: Number,
            required: true,
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            required: true,
        },

        experienceLevel: {
            type: String,
            enum: ["Fresher", "Junior", "Mid-Level", "Senior"],
            required: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        requirements: [
            {
                type: String,
                trim: true,
            },
        ],

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;