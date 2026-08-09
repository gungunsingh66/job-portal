import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getMyJobs, deleteJob } from "../../services/job.service.js";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await getMyJobs();

      console.log(response);

      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteJob(id);

      toast.success(response.message);

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

        <Link
          to="/recruiter/create-job"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Post New Job
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-10 text-center">
            <h2 className="text-xl font-semibold">No Jobs Posted Yet</h2>

            <p className="text-gray-500 mt-2">
              Click "Post New Job" to create your first job.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow rounded-lg p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>

                <p>{job.company}</p>

                <p>{job.location}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/recruiter/edit-job/${job._id}`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>

                <Link
                  to={`/recruiter/jobs/${job._id}/applicants`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  View Applicants
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
