import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { uploadResume, removeResume } from "../../services/auth.service.js";
import { loginSuccess } from "../../features/auth/authSlice.js";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume must be less than 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume first");
      return;
    }

    try {
      setUploading(true);

      const response = await uploadResume(selectedFile);

      dispatch(
        loginSuccess({
          ...user,
          resume: response.data.resume,
        }),
      );

      setSelectedFile(null);

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResume = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your resume?",
    );

    if (!confirmed) return;

    try {
      const response = await removeResume();

      dispatch(
        loginSuccess({
          ...user,
          resume: null,
        }),
      );

      toast.success(response.message);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to remove resume");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Personal Information */}
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

        <p>
          <span className="font-medium">Name:</span> {user?.name}
        </p>

        <p className="mt-2">
          <span className="font-medium">Email:</span> {user?.email}
        </p>

        <p className="mt-2">
          <span className="font-medium">Role:</span> {user?.role}
        </p>
      </div>

      {/* Resume */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Resume</h2>

        {user?.resume ? (
          <div className="mb-5">
            <p className="text-gray-600 mb-2">Your current resume:</p>

            <a
              href={user.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Current Resume
            </a>

            <button
                onClick={handleRemoveResume}
                className="text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50"
            >
                Remove Resume
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mb-5">No resume uploaded yet.</p>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          <label className="inline-block cursor-pointer">
            <span className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200">
              Choose Resume
            </span>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading..."
              : user?.resume
                ? "Replace Resume"
                : "Upload Resume"}
          </button>
        </div>

        {selectedFile && (
          <p className="text-gray-600 mt-3">Selected: {selectedFile.name}</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
