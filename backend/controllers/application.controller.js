import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const applyForJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { coverLetter = "" } = req.body || {};

  if (req.user.role !== "jobseeker") {
    throw new ApiError(403, "Only job seekers can apply for jobs");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.resume?.url) {
    throw new ApiError(400, "Please upload your resume before applying");
  }

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiter.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot apply to your own job");
  }

  const existingApplication = await Application.findOne({
    applicant: req.user._id,
    job: id,
  });

  if (existingApplication) {
    throw new ApiError(409, "You have already applied for this job");
  }

  const application = await Application.create({
    applicant: req.user._id,
    job: id,
    resume: user.resume.url,
    coverLetter,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, application, "Application submitted successfully"),
    );
});

const getMyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== "jobseeker") {
    throw new ApiError(403, "Only job seekers can view their applications");
  }

  const applications = await Application.find({
    applicant: req.user._id,
  })
    .populate({
      path: "job",
      populate: {
        path: "recruiter",
        select: "name email",
      },
    })
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications fetched successfully"),
    );
});

const getJobApplicants = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "recruiter") {
    throw new ApiError(403, "Only recruiters can view applicants");
  }

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to view applicants for this job",
    );
  }

  const applications = await Application.find({
    job: id,
  })
    .populate("applicant", "name email profilePic")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applicants fetched successfully"),
    );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (req.user.role !== "recruiter") {
    throw new ApiError(403, "Only recruiters can update application status");
  }

  const allowedStatus = ["Pending", "Reviewed", "Accepted", "Rejected"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid application status");
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const job = await Job.findById(application.job);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this application",
    );
  }

  application.status = status;

  await application.save();

  await application.populate([
    {
      path: "applicant",
      select: "name email profilePic",
    },
    {
      path: "job",
      select: "title company",
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        application,
        "Application status updated successfully",
      ),
    );
});

const checkApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findOne({
    applicant: req.user._id,
    job: id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        applied: !!application,
      },
      "Application status fetched successfully",
    ),
  );
});

export {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  checkApplicationStatus,
};
