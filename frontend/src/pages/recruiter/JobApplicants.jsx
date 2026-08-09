import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getJobApplicants,
  updateApplicationStatus,
} from "../../services/application.service.js";

function JobApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);

  const fetchApplicants = async () => {
    try {
      const response = await getJobApplicants(id);

      console.log(response);

      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const response = await updateApplicationStatus(applicationId, status);

      toast.success(response.message);

      setApplications((prevApplications) =>
        prevApplications.map((application) => {
          if (application._id === applicationId) {
            return {
              ...application,
              status,
            };
          }

          return application;
        }),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Job Applicants</h1>

      {applications.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            className="bg-white shadow rounded-lg p-6 mb-5"
          >
            <h2 className="text-xl font-semibold">
              {application.applicant.name}
            </h2>

            <p className="text-gray-600">{application.applicant.email}</p>

            <p className="text-gray-500 text-sm mt-2">
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </p>

            {application.resume && (
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 underline"
              >
                View Resume
              </a>
            )}

            {application.coverLetter && (
              <div className="mt-4">
                <p className="font-semibold">Cover Letter</p>

                <p className="text-gray-700 mt-1">{application.coverLetter}</p>
              </div>
            )}

            <p className="mt-4 flex items-center gap-2">
              <span className="font-semibold">Status:</span>

              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  application.status === "Pending"
                    ? "bg-yellow-500"
                    : application.status === "Accepted"
                      ? "bg-green-600"
                      : "bg-red-600"
                }`}
              >
                {application.status}
              </span>
            </p>
            {application.status === "Pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    handleStatusUpdate(application._id, "Accepted")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    handleStatusUpdate(application._id, "Rejected")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default JobApplicants;
