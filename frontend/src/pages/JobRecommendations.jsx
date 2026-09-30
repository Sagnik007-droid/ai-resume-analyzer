import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar.jsx";

function JobRecommendations() {
    const [jobRoles, setJobRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    const roleDetailsRef = useRef(null);

    useEffect(() => {
        const savedAnalysis = localStorage.getItem("resumeAnalysis");

        if (savedAnalysis) {
            try {
                const analysis = JSON.parse(savedAnalysis);

                setJobRoles(analysis.jobRoles || []);
            } catch (error) {
                console.error("Could not read saved job recommendations:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (selectedRole && roleDetailsRef.current) {
            roleDetailsRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, [selectedRole]);

    return (
        <main className="jobs-page">
            <Navbar />

            <section className="jobs-header">
                <p className="jobs-label">AI RESUME ANALYZER</p>

                <h1>Recommended Job Roles</h1>

                <p>
                    Based on the skills and information identified
                    from your resume.
                </p>
            </section>

            <section className="jobs-grid">

                {jobRoles.length > 0 ? (
                    jobRoles.map((role, index) => (
                        <article className="job-card" key={index}>

                            <div className="job-card-top">
                                <div className="job-icon">
                                    💼
                                </div>

                                <span className="job-level">
                                    Recommended
                                </span>
                            </div>

                            <h2>{role.role}</h2>

                            <p className="job-description">
                                {role.description}
                            </p>

                            <div className="job-skills">
                                <span className="job-skill">
                                    {role.matchScore}% Resume Match
                                </span>

                                <span className="job-skill">
                                    AI Recommended
                                </span>
                            </div>

                            <div className="match-section">
                                <div className="match-header">
                                    <span>Resume Match</span>
                                    <strong>{role.matchScore}%</strong>
                                </div>

                                <div className="match-bar">
                                    <div className="match-bar-fill"
                                    style={{
                                        width: `${role.matchScore}%`
                                    }}></div>
                                </div>
                            </div>

                            <button className="job-button"
                            onClick={() => setSelectedRole(role)}>
                                View Role
                            </button>

                        </article>
                    ))
                ) : (
                    <p>
                        No job recommendations found. Please analyze
                        your resume first.
                    </p>
                )}

            </section>

            {selectedRole && (
                <section 
                ref={roleDetailsRef}
                className="role-details-card">
                    <div className="role-details-header">
                        <div>
                            <p className="jobs-label">SELECTED ROLE</p>

                            <h2>{selectedRole.role}</h2>
                        </div>

                        <button
                        className="close-role-button"
                        onClick={() => setSelectedRole(null)}> 
                        ✕ 
                        </button>
                    </div>

                    <p className="role-details-description">
                        {selectedRole.description}
                    </p>

                    <div className="role-details-section">
                        <h3>Why this role matches</h3>

                        <p>
                            {selectedRole.whyItMatches}
                        </p>
                    </div>

                    <div className="role-details-section">

    <h3>Matching Skills</h3>

    <div className="role-skills-container">
        {selectedRole.matchingSkills?.map(
            (skill, index) => (
                <span
                    className="role-skill-tag"
                    key={index}
                >
                    {skill}
                </span>
            )
        )}
    </div>

</div>

<div className="role-details-section">

    <h3>Skills to Strengthen</h3>

    <div className="role-skills-container">

        {selectedRole.skillsToStrengthen?.length > 0 ? (
            selectedRole.skillsToStrengthen.map(
                (skill, index) => (
                    <span
                        className="role-skill-tag improve"
                        key={index}
                    >
                        {skill}
                    </span>
                )
            )
        ) : (
            <p>No skills to strengthen identified.</p>
        )}

    </div>

</div>

                    <div className="role-details-section">
                        <h3>Recommended next steps</h3>

                        <ul>
                            {selectedRole.nextSteps?.map(
                                (step, index) => (
                                    <li key={index}>
                                        {step}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </section>
            )}
        </main>
    );
}

export default JobRecommendations;