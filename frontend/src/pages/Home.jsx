import Navbar from "../components/Navbar.jsx";
import ResumeUpload from "../components/ResumeUpload.jsx";

function Home() {

    function scrollToUpload() {
        document
            .getElementById("upload-section")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    }

    return (
        <main className="home-page">

            <Navbar />

            {/* HERO */}

            <section className="hero-section">

                <div className="hero-background"></div>

                <div className="hero-content">

                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        AI-powered resume analysis
                    </div>

                    <h1>
                        Know exactly how
                        <span> strong your resume is.</span>
                    </h1>

                    <p>
                        Upload your resume and get an AI-powered ATS score,
                        skill analysis, actionable feedback and job recommendations.
                    </p>

                    <div className="hero-actions">

                        <button
                            className="primary-button"
                            onClick={scrollToUpload}
                        >
                            Analyze My Resume
                            <span>→</span>
                        </button>

                        <a
                            href="#how-it-works"
                            className="secondary-button"
                        >
                            See how it works
                        </a>

                    </div>

                    <div className="hero-trust">

                        <div className="trust-item">
                            <span>✓</span>
                            PDF resumes
                        </div>

                        <div className="trust-item">
                            <span>✓</span>
                            AI analysis
                        </div>

                        <div className="trust-item">
                            <span>✓</span>
                            ATS insights
                        </div>

                    </div>

                </div>

                {/* SAMPLE ANALYSIS CARD */}

                <div className="hero-preview">

                    <div className="preview-window">

                        <div className="preview-topbar">
                            <div className="preview-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <span>Resume analysis</span>
                        </div>

                        <div className="preview-content">

                            <div className="preview-score">

                                <div className="score-ring">
                                    <strong>78</strong>
                                    <span>/100</span>
                                </div>

                                <div>
                                    <span className="preview-label">
                                        Resume score
                                    </span>

                                    <h3>
                                        Good foundation
                                    </h3>

                                    <p>
                                        A few improvements could make
                                        your resume more ATS-friendly.
                                    </p>
                                </div>

                            </div>

                            <div className="preview-checks">

                                <div className="preview-check">
                                    <img
                                        src="/icons/ats-compatibility.svg"
                                        alt=""
                                    />

                                    <div>
                                        <strong>ATS compatibility</strong>
                                        <span>Strong</span>
                                    </div>
                                </div>

                                <div className="preview-check">
                                    <img
                                        src="/icons/keyword.svg"
                                        alt=""
                                    />

                                    <div>
                                        <strong>Keyword coverage</strong>
                                        <span>Needs improvement</span>
                                    </div>
                                </div>

                                <div className="preview-check">
                                    <img
                                        src="/icons/skills.svg"
                                        alt=""
                                    />

                                    <div>
                                        <strong>Skills detected</strong>
                                        <span>12 technical skills</span>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* PRODUCT HIGHLIGHTS */}

            <section className="feature-section">

                <div className="section-heading">

                    <span className="section-eyebrow">
                        EVERYTHING YOU NEED
                    </span>

                    <h2>
                        Turn your resume into a
                        <span> career advantage.</span>
                    </h2>

                    <p>
                        Understand what is working, what is missing,
                        and what you can improve before applying.
                    </p>

                </div>


                <div className="feature-grid">

                    <article className="feature-card">

                        <div className="feature-icon">
                            <img
                                src="/icons/ats-score.svg"
                                alt=""
                            />
                        </div>

                        <h3>
                            ATS Score
                        </h3>

                        <p>
                            See how well your resume is structured
                            for applicant tracking systems.
                        </p>

                    </article>


                    <article className="feature-card">

                        <div className="feature-icon">
                            <img
                                src="/icons/check.svg"
                                alt=""
                            />
                        </div>

                        <h3>
                            Resume Insights
                        </h3>

                        <p>
                            Discover strengths, weaknesses and
                            specific improvements for your resume.
                        </p>

                    </article>


                    <article className="feature-card">

                        <div className="feature-icon">
                            <img
                                src="/icons/job-match.svg"
                                alt=""
                            />
                        </div>

                        <h3>
                            Job Matches
                        </h3>

                        <p>
                            Find roles that match the skills and
                            experience identified in your resume.
                        </p>

                    </article>

                </div>

            </section>


            {/* HOW IT WORKS */}

            <section
                className="steps-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span className="section-eyebrow">
                        HOW IT WORKS
                    </span>

                    <h2>
                        Three simple steps.
                    </h2>

                </div>


                <div className="steps-grid">

                    <div className="step-card">

                        <span className="step-number">
                            01
                        </span>

                        <img
                            src="/images/pdf.png"
                            alt=""
                            className="step-icon"
                        />

                        <h3>
                            Upload your resume
                        </h3>

                        <p>
                            Upload your PDF resume and let the
                            analyzer prepare it for processing.
                        </p>

                    </div>


                    <div className="step-card">

                        <span className="step-number">
                            02
                        </span>

                        <div className="step-icon-placeholder">
                            ✦
                        </div>

                        <h3>
                            AI analyzes it
                        </h3>

                        <p>
                            Your resume is scanned for skills,
                            structure, keywords and ATS signals.
                        </p>

                    </div>


                    <div className="step-card">

                        <span className="step-number">
                            03
                        </span>

                        <div className="step-icon-placeholder">
                            ✓
                        </div>

                        <h3>
                            Get your insights
                        </h3>

                        <p>
                            Receive your score, feedback,
                            improvements and recommended roles.
                        </p>

                    </div>

                </div>

            </section>


            {/* UPLOAD */}

            <ResumeUpload />


            {/* FINAL CTA */}

            <section className="final-cta">

                <div>

                    <span className="section-eyebrow">
                        READY TO START?
                    </span>

                    <h2>
                        Give your resume
                        <span> an AI-powered review.</span>
                    </h2>

                    <p>
                        Find out what your resume is saying
                        before a recruiter does.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={scrollToUpload}
                >
                    Analyze My Resume
                    <span>→</span>
                </button>

            </section>


            <footer className="site-footer">

                <div>
                    <strong>ResumeAI</strong>
                    <span>
                        AI-powered resume analysis
                    </span>
                </div>

                <p>
                    Built with React, Node.js, PostgreSQL and AI.
                </p>

            </footer>

        </main>
    );
}

export default Home;