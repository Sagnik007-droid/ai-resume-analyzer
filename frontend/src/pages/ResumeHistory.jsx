import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";

function ResumeHistory() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://ai-resume-analyzer-3xoi.onrender.com/resumes")
            .then((response) => response.json())
            .then((data) => {
                setResumes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Could not load resume history:", error);
                setLoading(false);
            });
    }, []);

    function viewAnalysis(resume) {
        localStorage.setItem(
            "resumeAnalysis",
            JSON.stringify(resume.analysis)
        );

        localStorage.setItem(
            "resumeText",
            resume.resume_text || ""
        );

        localStorage.setItem(
            "resumeFilename",
            resume.filename
        );

        window.location.href = "/analysis";
    }

    return (
        <main className="jobs-page">
            <Navbar />

            <section className="jobs-header">
                <p className="jobs-label">AI RESUME ANALYZER</p>

                <h1>Resume History</h1>

                <p>
                    View resumes you have previously analyzed.
                </p>
            </section>

            <section className="jobs-grid">
                {loading ? (
                    <p>Loading resume history...</p>
                ) : resumes.length > 0 ? (
                    resumes.map((resume) => (
                        <article className="job-card" key={resume.id}>
                            <div className="job-card-top">
                                <div className="job-icon"><img src="/images/pdf.png"/></div>

                                <span className="job-level">
                                    Analyzed
                                </span>
                            </div>

                            <h2>{resume.filename}</h2>

                            <p className="job-description">
                                Resume Score:{" "}
                                <strong>
                                    {resume.analysis?.score ?? "N/A"}/100
                                </strong>
                            </p>

                            <p className="job-description">
                                Analyzed on:{" "}
                                {new Date(
                                    resume.created_at
                                ).toLocaleDateString()}
                            </p>

                            <button
                                className="job-button"
                                onClick={() => viewAnalysis(resume)}
                            >
                                View Analysis
                            </button>
                        </article>
                    ))
                ) : (
                    <p>No analyzed resumes found.</p>
                )}
            </section>
        </main>
    );
}

export default ResumeHistory;