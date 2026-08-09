import api from "../api/axios.js";

const getAllJobs = async (
  keyword = "",
  location = "",
  jobType = "",
  experienceLevel = "",
) => {
  const response = await api.get("/jobs", {
    params: {
      keyword,
      location,
      jobType,
      experienceLevel,
    },
  });

  return response.data;
};

const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

const getMyJobs = async () => {

    const response = await api.get("/jobs/my-jobs");

    return response.data;

};

const createJob = async (jobData) => {

    const response = await api.post(
        "/jobs/create",
        jobData
    );

    return response.data;

};

const deleteJob = async (id) => {

    const response = await api.delete(`/jobs/${id}`);

    return response.data;

};

const updateJob = async (id, jobData) => {

    const response = await api.put(
        `/jobs/${id}`,
        jobData
    );

    return response.data;

};

export { getAllJobs, getJobById, getMyJobs, createJob, deleteJob, updateJob };
