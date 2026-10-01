import { useState } from "react";

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setMessage("");
        }
    }

    async function handleUpload() {
        if (!file) {
            setMessage("Please select a resume first.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setMessage("Uploading resume...");

            const response = await fetch("https://ai-resume-analyzer-3xoi.onrender.com/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("BACKEND RESPONSE:", data);

            if (response.ok) {
                setMessage("Resume analyzed successfully!");

                console.log("Extracted Resume Text");
                console.log(data.text);

                console.log("AI Analysis:");
                console.log(data.analysis);

                localStorage.setItem("resumeAnalysis", JSON.stringify(data.analysis));
                localStorage.setItem("resumeText", data.text);
                localStorage.setItem("resumeFilename", data.filename);
                console.log("SAVED ANALYSIS:", localStorage.getItem("resumeAnalysis"));

                window.location.href = "/analysis";
            } else {
                setMessage(data.message || "Upload failed.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Could not connect to the backend.");
        }
    }

    return (
        <div className="upload-section" id="upload-section">

            <div className="upload-header">
                <h2>Upload Your Resume</h2>

                <p>
                    Uplaod your resume and let our AI analyze your
                    skills, experience and overall resume quyality.
                </p>
            </div>

            <label className="upload-box">
                
                 <div className="upload-icon">
                  📄
                 </div>

                <span>
                    {file ? file.name : "Choose your resume"}
                </span>

                <span className="upload-subtitle">
                    PDF only
                </span>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                />
            </label>

            {file && (
                <button
                    className="analyze-button"
                    onClick={handleUpload}
                >
                    Analyze Resume
                </button>
            )}

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default ResumeUpload;