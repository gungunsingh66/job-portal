import Job from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    salary,
    jobType,
    experienceLevel,
    description,
    requirements,
  } = req.body;

  if (
    [title, company, location, jobType, experienceLevel, description].some(
      (field) => !field || field.trim() === "",
    ) ||
    salary === undefined
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (req.user.role !== "recruiter") {
    throw new ApiError(403, "Only recruiters can create jobs");
  }

  const job = await Job.create({
    title,
    company,
    location,
    salary,
    jobType,
    experienceLevel,
    description,
    requirements,
    recruiter: req.user._id,
  });

  if (!job) {
    throw new ApiError(500, "Failed to create job");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job created successfully"));
});

const getAllJobs = asyncHandler(async (req, res) => {

    const {
        keyword,
        location,
        jobType,
        page = 1,
        limit = 10,
    } = req.query;

    const query = {};

    if (keyword) {
        query.$or = [
            {
                title: {
                    $regex: keyword,
                    $options: "i",
                },
            },
            {
                company: {
                    $regex: keyword,
                    $options: "i",
                },
            },
        ];
    }

    if (location) {
        query.location = {
            $regex: location,
            $options: "i",
        };
    }

    if (jobType) {
        query.jobType = jobType;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const jobs = await Job.find(query)
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const totalJobs = await Job.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobs,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalJobs / limitNumber),
                totalJobs,
            },
            "Jobs fetched successfully"
        )
    );
});

const getJobById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const job = await Job.findById(id).populate(
        "recruiter",
        "name email"
    );

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            job,
            "Job fetched successfully"
        )
    );
});

const updateJob = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        title,
        company,
        location,
        salary,
        jobType,
        experienceLevel,
        description,
        requirements,
    } = req.body;

    // Find the job
    const job = await Job.findById(id);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // Only the recruiter who created the job can update it
    if (job.recruiter.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this job"
        );
    }

    // Update only provided fields
    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.salary = salary ?? job.salary;
    job.jobType = jobType || job.jobType;
    job.experienceLevel = experienceLevel || job.experienceLevel;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;

    const updatedJob = await job.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedJob,
            "Job updated successfully"
        )
    );
});

const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find Job
    const job = await Job.findById(id);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // Ownership Check
    if (job.recruiter.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this job"
        );
    }

    // Delete Job
    await job.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Job deleted successfully"
        )
    );
});

const getMyJobs = asyncHandler(async (req, res) => {

    const jobs = await Job.find({
        recruiter: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            jobs,
            "Recruiter jobs fetched successfully"
        )
    );

});


export { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs };
