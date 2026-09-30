function ResumeCard() {
    return (
        <div className="resume-card">

            <div className="resume-card-header">
                <div>
                    <h2>My Resume</h2>
                    <p>AI-powered resume analysis</p>
                </div>

                <div className="resume-score">
                    <strong>82</strong>
                    <span>/100</span>
                </div>
            </div>

            <div className="resume-preview">
                <div className="resume-preview-content">
                    <h3>SAGNIK MANNA</h3>

                    <p>
                        Web Development • JavaScript • React • SQL
                    </p>

                    <hr/>

                    <h4>Technical Skills</h4>

                    <p>
                        HTML5, CSS3, JavaScript, Python, Java, SQL and DBMS
                    </p>

                    <h4>Projects</h4>

                    <p>
                        Personal Portfolio Website and Android Flashlight App
                    </p>
                </div>
            </div>


            <div className="resume-card-info">

                <div>
                    <h3>Resume Status</h3>
                    <p>Your resume has been successfully uploaded.</p>
                </div>

                <div>
                    <h3>AI Feedback</h3>
                    <p>
                        Your resume looks good, but there are areas
                        that can be improved.
                    </p>
                </div>

            </div>


            <div className="resume-card-footer">
                <span>Last analyzed: Today</span>

                <button>
                    View Analysis
                </button>
            </div>

        </div>
    );
}

export default ResumeCard;