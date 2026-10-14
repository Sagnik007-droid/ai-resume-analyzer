import { Link } from "react-router-dom";
import { API_BASE } from "../api.js";

function Navbar() {
    async function logout() {
        try {
            await fetch(API_BASE + "/auth/logout", { method: "POST", credentials: "include" });
        } finally {
            localStorage.removeItem("resumeAnalysis");
            localStorage.removeItem("resumeText");
            localStorage.removeItem("resumeFilename");
            window.location.href = "/";
        }
    }
    return (
        <header className="site-navbar">
            <div className="navbar-inner">
                <Link to="/" className="brand">
                    <div className="brand-mark">AI</div>
                    <div className="brand-text"><strong>ResumeAI</strong><span>Smart resume analysis</span></div>
                </Link>
                <nav className="navbar-links">
                    <Link to="/">Home</Link><Link to="/dashboard">Dashboard</Link>
                    <Link to="/history">My Resumes</Link><Link to="/jobs">Job Matches</Link>
                </nav>
                <div className="navbar-account-actions">
                    <Link to="/" className="navbar-cta">Analyze Resume</Link>
                    <button type="button" className="navbar-logout" onClick={logout}>Sign out</button>
                </div>
            </div>
        </header>
    );
}
export default Navbar;