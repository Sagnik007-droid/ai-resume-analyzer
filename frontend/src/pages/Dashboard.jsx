import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:5000/dashboard"),
            fetch("http://localhost:5000/resumes")
        ])
            .then(async ([statsResponse, resumesResponse]) => {
                const statsData = await statsResponse.json();
                const resumesData = await resumesResponse.json();

                setStats(statsData);
                setResumes(resumesData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Could not load dashboard:", error);
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
        <main className="dashboard-page">
            <Navbar />

            <section className="dashboard-header">
                <p className="jobs-label">AI RESUME ANALYZER</p>

                <h1>Dashboard</h1>

                <p>
                    Overview of your resume analysis activity.
                </p>
            </section>

            {loading ? (
                <section className="dashboard-content">
                    <p>Loading dashboard...</p>
                </section>
            ) : stats ? (
                <section className="dashboard-content">

                    <div className="dashboard-stats">

                        <article className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">📄</div>

                            <div>
                                <h2>{stats.total_resumes}</h2>
                                <p>Resumes Analyzed</p>
                            </div>
                        </article>

                        <article className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">📊</div>

                            <div>
                                <h2>{stats.average_score}/100</h2>
                                <p>Average Resume Score</p>
                            </div>
                        </article>

                        <article className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">⭐</div>

                            <div>
                                <h2>{stats.latest_score}/100</h2>
                                <p>Latest Resume Score</p>
                            </div>
                        </article>

                    </div>

                    <section className="recent-resumes">

                        <div className="recent-resumes-header">
                            <div>
                                <p className="jobs-label">ACTIVITY</p>
                                <h2>Recent Resume Activity</h2>
                            </div>

                            <a href="/history" className="view-history-link">
                                View All
                            </a>
                        </div>

                        {resumes.length > 0 ? (
                            <div className="recent-resume-list">

                                {resumes.slice(0, 5).map((resume) => (
                                    <article
                                        className="recent-resume-item"
                                        key={resume.id}
                                    >
                                        <div className="recent-resume-info">

                                            <div className="recent-resume-icon">
                                                📄
                                            </div>

                                            <div>
                                                <h3>{resume.filename}</h3>

                                                <p>
                                                    Analyzed on{" "}
                                                    {new Date(
                                                        resume.created_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="recent-resume-score">
                                            <strong>
                                                {resume.analysis?.score ?? "N/A"}/100
                                            </strong>

                                            <button
                                                onClick={() =>
                                                    viewAnalysis(resume)
                                                }
                                            >
                                                View Analysis
                                            </button>
                                        </div>
                                    </article>
                                ))}

                            </div>
                        ) : (
                            <p>No analyzed resumes found.</p>
                        )}

                    </section>

                </section>
            ) : (
                <section className="dashboard-content">
                    <p>Could not load dashboard data.</p>
                </section>
            )}
        </main>
    );
}

export default Dashboard;