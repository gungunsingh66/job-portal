import { useState } from "react";
import { uploadResume } from "../services/auth.service";
import toast from "react-hot-toast";

function ResumeUpload() {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);
    };

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a resume");
            return;
        }

        try {

            setLoading(true);

            const response = await uploadResume(file);

            console.log("Resume uploaded:", response);

            toast.success("Resume uploaded successfully");

        } catch (error) {

            console.error("Resume upload failed:", error);

            alert(
                error.response?.data?.message ||
                "Resume upload failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="p-6 border rounded-lg">

            <h2 className="text-xl font-semibold mb-4">
                Upload Resume
            </h2>

            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
            />

            {file && (
                <p className="mt-2">
                    Selected: {file.name}
                </p>
            )}

            <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {loading ? "Uploading..." : "Upload Resume"}
            </button>

        </div>
    );
}

export default ResumeUpload;