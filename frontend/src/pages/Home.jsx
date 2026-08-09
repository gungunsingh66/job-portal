import { useEffect, useState } from "react";
import { getAllJobs } from "../services/job.service.js";
import JobCard from "../components/JobCard";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await getAllJobs(
        debouncedKeyword,
        location,
        jobType,
        experience,
      );

      setJobs(response.data.jobs);
      console.log("Jobs from API:", response.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  useEffect(() => {
    fetchJobs();
  }, [debouncedKeyword, location, jobType, experience]);

  console.log("Jobs state:", jobs);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Location */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Locations</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
        </select>

        {/* Job Type */}
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        {/* Experience */}
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="Junior">Junior</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <h1 className="text-3xl font-bold mb-6">Latest Jobs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default Home;
