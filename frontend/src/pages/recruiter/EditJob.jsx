import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { getJobById } from "../../services/job.service.js";
import { updateJob } from "../../services/job.service.js";

function EditJob() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchJob = async () => {
    try {
      const response = await getJobById(id);

      reset({
        ...response.data,

        requirements: response.data.requirements.join(", "),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const onSubmit = async (data) => {
    try {
      data.requirements = data.requirements
        .split(",")
        .map((item) => item.trim());

      const response = await updateJob(id, data);

      toast.success(response.message);

      navigate("/recruiter/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-8">Create Job</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label className="block mb-2 font-medium">Job Title</label>

          <input
            type="text"
            placeholder="Enter Job Title"
            className="w-full border rounded-lg p-3"
            {...register("title", {
              required: "Job title is required",
            })}
          />

          <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-medium">Company</label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Google"
            {...register("company", {
              required: "Company name is required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.company?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-medium">Location</label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Bangalore"
            {...register("location", {
              required: "Location is required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.location?.message}</p>
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-medium">Salary</label>

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            placeholder="1200000"
            {...register("salary", {
              required: "Salary is required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.salary?.message}</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Job Type</label>

          <select
            className="w-full border rounded-lg p-3"
            {...register("jobType", {
              required: "Job Type is required",
            })}
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <p className="text-red-500 text-sm">{errors.jobType?.message}</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Experience Level</label>

          <select
            className="w-full border rounded-lg p-3"
            {...register("experienceLevel", {
              required: "Experience Level is required",
            })}
          >
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>

          <p className="text-red-500 text-sm">
            {errors.experienceLevel?.message}
          </p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            rows="5"
            className="w-full border rounded-lg p-3"
            placeholder="Write Job Description..."
            {...register("description", {
              required: "Description is required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.description?.message}</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Requirements</label>

          <textarea
            rows="4"
            className="w-full border rounded-lg p-3"
            placeholder="React, Node.js, Express.js, MongoDB"
            {...register("requirements", {
              required: "Requirements are required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.requirements?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Update Job
        </button>
      </form>
    </div>
  );
}

export default EditJob;
