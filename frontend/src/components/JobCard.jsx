import { Link } from "react-router-dom";

function JobCard({ job }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 border">

            <h2 className="text-xl font-bold">
                {job.title}
            </h2>

            <p className="text-gray-700 mt-2">
                <strong>Company:</strong> {job.company}
            </p>

            <p className="text-gray-700">
                <strong>Location:</strong> {job.location}
            </p>

            <p className="text-gray-700">
                <strong>Salary:</strong> ₹{job.salary.toLocaleString()}
            </p>

            <Link
                to={`/jobs/${job._id}`}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                View Details
            </Link>

        </div>
    );
}

export default JobCard;