import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";

function Analysis() {
    const [analysis, setAnalysis] = useState(null);
    const [filename, setFilename] = useState("");

    useEffect(() => {
        const savedAnalysis = localStorage.getItem("resumeAnalysis");
        const savedFilename = localStorage.getItem("resumeFilename");

        if (savedFilename) {
            setFilename(savedFilename);
        }

        if (savedAnalysis) {
            try {
                const parsedAnalysis = JSON.parse(savedAnalysis);
                setAnalysis(parsedAnalysis);
            } catch (error) {
                console.error("Could not read saved analysis:", error);
            }
        }
    }, []);

    if (!analysis) {
        return (
            <main className="analysis-page">
                <Navbar />

                <section className="analysis-header">
                    <p className="analysis-label">
                        AI RESUME ANALYZER
                    </p>

                    <h1>Resume Analysis</h1>

                    <p>
                        No analysis found. Please upload your resume again.
                    </p>
                </section>
            </main>
        );
    }

    return (
        <main className="analysis-page">
            <Navbar />

            {/* Header */}

            <section className="analysis-header">

                <p className="analysis-label">
                    AI RESUME ANALYZER
                </p>

                <h1>
                    Your Resume Analysis
                </h1>

                {filename && (
                    <p className="analysis-filename">
                        📄 {filename}
                    </p>
                )}

                <p>
                    Here is the AI-powered analysis of your uploaded resume.
                </p>

            </section>


            {/* Resume Score */}

            <section className="score-card">

                <div className="score-info">

                    <span className="card-icon">
                        📊
                    </span>

                    <div>
                        <h2>Resume Score</h2>

                        <p>
                            Overall resume quality
                        </p>
                    </div>

                </div>


                <div className="score-circle">

                    <strong>
                        {analysis.score}
                    </strong>

                    <span>
                        /100
                    </span>

                </div>

            </section>


            {/* Score Breakdown */}

            {analysis.scoreBreakdown && (
                <section className="analysis-card">

                    <div className="card-heading">

                        <span>📈</span>

                        <h2>
                            Score Breakdown
                        </h2>

                    </div>


                    <div className="score-breakdown">

                        {[
                            ["Skills", analysis.scoreBreakdown.skills],
                            ["Experience", analysis.scoreBreakdown.experience],
                            ["Projects", analysis.scoreBreakdown.projects],
                            ["Formatting", analysis.scoreBreakdown.formatting],
                            [
                                "ATS Compatibility",
                                analysis.scoreBreakdown.atsCompatibility
                            ]
                        ].map(([label, score]) => (

                            <div
                                className="breakdown-item"
                                key={label}
                            >

                                <div className="breakdown-header">

                                    <span>
                                        {label}
                                    </span>

                                    <strong>
                                        {score ?? 0}/100
                                    </strong>

                                </div>

                                <div className="breakdown-bar">

                                    <div
                                        className="breakdown-bar-fill"
                                        style={{
                                            width: `${score ?? 0}%`
                                        }}
                                    ></div>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>
            )}


            {/* Strengths + Weaknesses */}

            <section className="analysis-grid">

                <div className="analysis-card">

                    <div className="card-heading">

                        <span>💪</span>

                        <h2>
                            Key Strengths
                        </h2>

                    </div>


                    <ul>

                        {analysis.strengths?.map(
                            (item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            )
                        )}

                    </ul>

                </div>


                <div className="analysis-card">

                    <div className="card-heading">

                        <span>⚠️</span>

                        <h2>
                            Areas to Improve
                        </h2>

                    </div>


                    <ul>

                        {analysis.weaknesses?.map(
                            (item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            )
                        )}

                    </ul>

                </div>

            </section>


            {/* Technical Skills */}

            <section className="analysis-card">

                <div className="card-heading">

                    <span>💻</span>

                    <h2>
                        Technical Skills
                    </h2>

                </div>


                <div className="skills-container">

                    {analysis.skills?.map(
                        (skill, index) => (

                            <span
                                className="skill-tag"
                                key={index}
                            >
                                {skill}
                            </span>

                        )
                    )}

                </div>

            </section>


            {/* ATS Keywords */}

            {analysis.atsKeywords && (
                <section className="analysis-grid">

                    <div className="analysis-card">

                        <div className="card-heading">

                            <span>🔎</span>

                            <h2>
                                Detected ATS Keywords
                            </h2>

                        </div>


                        <div className="skills-container">

                            {analysis.atsKeywords.detected?.map(
                                (keyword, index) => (

                                    <span
                                        className="skill-tag"
                                        key={index}
                                    >
                                        {keyword}
                                    </span>

                                )
                            )}

                        </div>

                    </div>


                    <div className="analysis-card">

                        <div className="card-heading">

                            <span>💡</span>

                            <h2>
                                Suggested Keywords
                            </h2>

                        </div>


                        <div className="skills-container">

                            {analysis.atsKeywords.suggested?.map(
                                (keyword, index) => (

                                    <span
                                        className="skill-tag"
                                        key={index}
                                    >
                                        {keyword}
                                    </span>

                                )
                            )}

                        </div>

                    </div>

                </section>
            )}


            {/* Suggested Improvements */}

            <section className="analysis-card">

                <div className="card-heading">

                    <span>🚀</span>

                    <h2>
                        Suggested Improvements
                    </h2>

                </div>


                <ul>

                    {analysis.improvements?.map(
                        (item, index) => (
                            <li key={index}>
                                {item}
                            </li>
                        )
                    )}

                </ul>

            </section>


            {/* Suitable Job Roles */}

            <section className="analysis-card">

                <div className="card-heading">

                    <span>🎯</span>

                    <h2>
                        Suitable Job Roles
                    </h2>

                </div>


                <div className="roles-container">

                    {analysis.jobRoles?.map(
                        (role, index) => (

                            <div
                                className="role-card"
                                key={index}
                            >

                                <strong>
                                    {role.role}
                                </strong>

                                <span>
                                    {role.matchScore}% Match
                                </span>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* Actions */}

            <div className="analysis-actions">

                <a
                    href="/jobs"
                    className="back-button"
                >
                    🎯 View Job Recommendations
                </a>

                <br />

                <a
                    href="/"
                    className="back-button"
                    style={{
                        marginTop: "12px"
                    }}
                >
                    ← Analyze Another Resume
                </a>

            </div>

        </main>
    );
}

export default Analysis;