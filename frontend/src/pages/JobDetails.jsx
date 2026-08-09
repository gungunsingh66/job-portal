import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  applyForJob,
  checkApplicationStatus,
} from "../services/application.service.js";
import { getJobById } from "../services/job.service.js";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  console.log(id);

  const fetchJob = async () => {
    try {
      const response = await getJobById(id);
      setJob(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await checkApplicationStatus(id);

      console.log(response);

      setHasApplied(response.data.applied);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJob();
    checkStatus();
  }, [id]);

  if (!job) {
    return <h1 className="text-center mt-10">Loading...</h1>;
  }

  const handleApply = async () => {
    try {
      const response = await applyForJob(id, coverLetter);

      toast.success(response.message);
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900">{job.title}</h1>

        <p className="text-xl text-gray-600 mt-2">{job.company}</p>

        <div className="flex flex-wrap gap-3 mt-6">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
            📍 {job.location}
          </span>

          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
            💼 {job.jobType}
          </span>

          <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full">
            ⭐ {job.experienceLevel}
          </span>

          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full">
            💰 ₹{job.salary.toLocaleString()}
          </span>
        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-3">Job Description</h2>

        <p className="text-gray-700 leading-7">{job.description}</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">Skills Required</h2>

        <div className="flex flex-wrap gap-3">
          {job.requirements.map((skill, index) => (
            <span key={index} className="bg-gray-100 px-4 py-2 rounded-lg">
              {skill}
            </span>
          ))}
        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">Recruiter</h2>

        <p className="font-medium">{job.recruiter.name}</p>

        <p className="text-gray-600">{job.recruiter.email}</p>

        {!hasApplied && (
          <div className="mt-8">
            <label className="block font-semibold mb-2">Cover Letter</label>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a short cover letter..."
              rows="6"
              className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          onClick={handleApply}
          disabled={hasApplied}
          className={`mt-8 w-full py-3 rounded-lg font-semibold transition ${
            hasApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {hasApplied ? "Already Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
}

export default JobDetails;
