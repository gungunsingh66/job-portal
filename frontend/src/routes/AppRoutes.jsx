import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import JobDetails from "../pages/JobDetails";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterRoute from "../components/RecruiterRoute";
import CreateJob from "../pages/recruiter/CreateJob";
import EditJob from "../pages/recruiter/EditJob";
import JobApplicants from "../pages/recruiter/JobApplicants";
import MyApplications from "../pages/MyApplications";
import JobSeekerRoute from "../components/JobSeekerRoutes";
import Profile from "../pages/profile/Profile";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RecruiterRoute>
                <RecruiterDashboard />
              </RecruiterRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/create-job"
          element={
            <ProtectedRoute>
              <RecruiterRoute>
                <CreateJob />
              </RecruiterRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/edit-job/:id"
          element={
            <ProtectedRoute>
              <RecruiterRoute>
                <EditJob />
              </RecruiterRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:id/applicants"
          element={
            <ProtectedRoute>
              <RecruiterRoute>
                <JobApplicants />
              </RecruiterRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <JobSeekerRoute>
                <MyApplications />
              </JobSeekerRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <JobSeekerRoute>
                <Profile />
              </JobSeekerRoute>
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
