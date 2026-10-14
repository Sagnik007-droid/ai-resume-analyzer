import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Analysis from "./pages/Analysis.jsx";
import JobRecommendations from "./pages/JobRecommendations.jsx";
import ResumeHistory from "./pages/ResumeHistory.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AuthGate from "./AuthGate.jsx";
import Account from "./pages/Account.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/jobs" element={<JobRecommendations />} />
                <Route path="/history" element={<ResumeHistory />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account" element={<AuthGate><Account /></AuthGate>} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;