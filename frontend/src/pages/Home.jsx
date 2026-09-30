import ResumeUpload from "../components/ResumeUpload.jsx";
import ResumeCard from "../components/ResumeCard.jsx";
import Navbar from "../components/Navbar.jsx";

function Home() {
    return (
        <main>
            <Navbar/>

                <section className="hero">
                    <div className="hero-content">
                    <h1>AI-Powered Resume Analysis</h1>
                    <p>
                        Analyze your resume and get intelligent feedback to improve your chances of landing your dream job.
                    </p>

                    <button
                    onClick={() => {
                        document
                        .getElementById("upload-section")
                        .scrollIntoView({ behavior: "smooth" });
                    }}>
                        Analyze My Resume
                        
                    </button>
                    </div>
                </section>

                <section>
                    <ResumeCard/>
                </section>

                <section>
                    <ResumeUpload/>
                </section>
        </main>
    )
}

export default Home