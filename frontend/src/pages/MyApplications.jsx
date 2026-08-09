import { useEffect, useState } from "react";
import { getMyApplications } from "../services/application.service.js";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await getMyApplications();

      console.log(response);

      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-600">You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            className="bg-white shadow rounded-xl p-6 mb-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{application.job.title}</h2>

                <p className="text-gray-600 mt-1">{application.job.company}</p>

                <p className="text-gray-500">📍 {application.job.location}</p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
                  application.status === "Pending"
                    ? "bg-yellow-500"
                    : application.status === "Accepted"
                      ? "bg-green-600"
                      : "bg-red-600"
                }`}
              >
                {application.status}
              </span>
            </div>

            <hr className="my-5" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Salary</p>

                <p className="font-semibold">
                  ₹{application.job.salary.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Job Type</p>

                <p className="font-semibold">{application.job.jobType}</p>
              </div>

              <div>
                <p className="text-gray-500">Recruiter</p>

                <p className="font-semibold">
                  {application.job.recruiter.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Applied On</p>

                <p className="font-semibold">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;
