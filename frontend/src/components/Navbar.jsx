import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header className="site-navbar">
            <div className="navbar-inner">

                <Link to="/" className="brand">
                    <div className="brand-mark">
                        AI
                    </div>

                    <div className="brand-text">
                        <strong>ResumeAI</strong>
                        <span>Smart resume analysis</span>
                    </div>
                </Link>

                <nav className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/history">My Resumes</Link>
                    <Link to="/jobs">Job Matches</Link>
                </nav>

                <Link
                    to="/"
                    className="navbar-cta"
                >
                    Analyze Resume
                </Link>

            </div>
        </header>
    );
}

export default Navbar;