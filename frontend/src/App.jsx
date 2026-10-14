import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGate from "./AuthGate.jsx";
import Home from "./pages/Home.jsx";
import Analysis from "./pages/Analysis.jsx";
import JobRecommendations from "./pages/JobRecommendations.jsx";
import ResumeHistory from "./pages/ResumeHistory.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthGate>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/jobs" element={<JobRecommendations />} />
                    <Route path="/history" element={<ResumeHistory />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </AuthGate>
        </BrowserRouter>
    );
}
export default App;