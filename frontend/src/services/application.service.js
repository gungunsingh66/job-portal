import api from "../api/axios.js";

const applyForJob = async (jobId, coverLetter) => {
  const response = await api.post(`/applications/${jobId}/apply`, {
    coverLetter,
  });

  return response.data;
};

const checkApplicationStatus = async (jobId) => {
  const response = await api.get(`/applications/${jobId}/status`);

  return response.data;
};

const getJobApplicants = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);

  return response.data;
};

const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/applications/${applicationId}/status`, {
    status,
  });

  return response.data;
};

const getMyApplications = async () => {
  const response = await api.get("/applications/my");

  return response.data;
};

export {
  applyForJob,
  checkApplicationStatus,
  getJobApplicants,
  updateApplicationStatus,
  getMyApplications,
};
