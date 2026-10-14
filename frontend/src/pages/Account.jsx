import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function Account() {
    return (
        <main className="jobs-page">
            <Navbar />
            <section className="jobs-header">
                <p className="jobs-label">RESUMEAI ACCOUNT</p>
                <h1>Your account</h1>
                <p>Sign in to view your private resume history and dashboard. Public resume analysis remains available without an account.</p>
                <p><Link to="/history">My Resumes</Link> · <Link to="/dashboard">Dashboard</Link></p>
            </section>
        </main>
    );
}
