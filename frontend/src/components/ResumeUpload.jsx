import { useState, useEffect } from "react";

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [scanStage, setScanStage] = useState(1);

    useEffect(() => {
        if (!isAnalyzing) {
            setScanStage(1);
            return;
        }

        const timer = setTimeout(() => {
            setScanStage(2);
        }, 2500);

        return() => clearTimeout(timer);
    }, [isAnalyzing]);

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            setFile(null);
            setMessage("Please select a PDF resume.");
            return;
        }

        setFile(selectedFile);
        setMessage("");
    }

    async function handleUpload() {
        if (!file) {
            setMessage("Please select a resume first.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setIsAnalyzing(true);
            setMessage("");

            const response = await fetch(
                "https://ai-resume-analyzer-3xoi.onrender.com/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(
                    "resumeAnalysis",
                    JSON.stringify(data.analysis)
                );

                localStorage.setItem(
                    "resumeText",
                    data.text
                );

                localStorage.setItem(
                    "resumeFilename",
                    data.filename
                );

                window.location.href = "/analysis";
            } else {
                setIsAnalyzing(false);
                setMessage(data.message || "Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Resume upload error:", error);

            setIsAnalyzing(false);
            setMessage(
                "Could not connect to the server. Please try again."
            );
        }
    }

    return (
        <section
            className="upload-section"
            id="upload-section"
        >
            {isAnalyzing ? (
                <div className="upload-scanning-state">

                    <img
                        src={
                            scanStage === 1
                            ? "/images/resume-scan-2.gif"
                            : "/images/resume-scan.gif"
                        }
                        alt="Scanning resume"
                        className="resume-scan-animation"
                    />

                    <div className="scanning-content">

                        <span className="section-eyebrow">
                            AI RESUME ANALYSIS
                        </span>

                        <h2>
                            Analyzing your resume...
                        </h2>

                        <p>
                            Our AI is reviewing your resume,
                            skills, keywords and ATS compatibility.
                        </p>

                        <div className="scanning-file">
                            <span className="scanning-file-icon">
                                PDF
                            </span>

                            <span>
                                {file?.name}
                            </span>
                        </div>

                        <div className="scanning-status">
                            <span className="scanning-dot"></span>
                            Processing resume
                        </div>

                    </div>

                </div>
            ) : (
                <>
                    <div className="upload-header">

                        <span className="section-eyebrow">
                            START YOUR ANALYSIS
                        </span>

                        <h2>
                            Upload your resume
                        </h2>

                        <p>
                            Upload your PDF resume and let our AI analyze
                            your skills, experience and ATS readiness.
                        </p>

                    </div>

                    <label className="upload-box">

                        <div className="upload-icon">
                            <img
                                src="/images/pdf.png"
                                alt=""
                            />
                        </div>

                        <strong>
                            {file
                                ? file.name
                                : "Choose your resume"}
                        </strong>

                        <span className="upload-subtitle">
                            PDF files only
                        </span>

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                        />

                    </label>

                    {file && (
                        <button
                            className="analyze-button"
                            onClick={handleUpload}
                        >
                            Analyze Resume
                            <span>→</span>
                        </button>
                    )}

                    {message && (
                        <p className="upload-message">
                            {message}
                        </p>
                    )}
                </>
            )}
        </section>
    );
}

export default ResumeUpload;