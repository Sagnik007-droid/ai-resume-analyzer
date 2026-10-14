import { useEffect, useState } from "react";
import "./AuthGate.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://ai-resume-analyzer-3xoi.onrender.com";

export default function AuthGate({ children }) {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        fetch(API_BASE + "/auth/me", { credentials: "include" })
            .then(async (response) => {
                if (!response.ok) return null;
                const data = await response.json();
                return data.user || null;
            })
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setChecking(false));
    }, []);

    async function submit(event) {
        event.preventDefault();
        setMessage("");
        setBusy(true);
        try {
            const response = await fetch(API_BASE + (mode === "register" ? "/auth/register" : "/auth/login"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Authentication failed.");
            localStorage.removeItem("resumeAnalysis");
            localStorage.removeItem("resumeText");
            localStorage.removeItem("resumeFilename");
            setUser(data.user);
        } catch (error) {
            setMessage(error.message || "Could not connect to the server.");
        } finally {
            setBusy(false);
        }
    }

    if (checking) {
        return <main className="auth-page"><section className="auth-card"><h1>ResumeAI</h1><p>Checking your session…</p></section></main>;
    }

    if (!user) {
        return (
            <main className="auth-page">
                <section className="auth-card">
                    <div className="auth-brand-mark">AI</div>
                    <p className="auth-eyebrow">AI-POWERED RESUME ANALYSIS</p>
                    <h1>{mode === "register" ? "Create your account" : "Welcome back"}</h1>
                    <p className="auth-description">
                        {mode === "register" ? "Create an account to keep your resume history private." : "Sign in to access your own resume analyses and dashboard."}
                    </p>
                    <form onSubmit={submit} className="auth-form">
                        <label htmlFor="auth-email">Email address</label>
                        <input id="auth-email" type="email" autoComplete="email" required maxLength={254}
                            value={email} onChange={(event) => setEmail(event.target.value)} />
                        <label htmlFor="auth-password">Password</label>
                        <input id="auth-password" type="password"
                            autoComplete={mode === "register" ? "new-password" : "current-password"}
                            required minLength={mode === "register" ? 8 : undefined} maxLength={128}
                            value={password} onChange={(event) => setPassword(event.target.value)} />
                        {mode === "register" && <p className="auth-hint">Use at least 8 characters.</p>}
                        {message && <p className="auth-error" role="alert">{message}</p>}
                        <button type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button>
                    </form>
                    <p className="auth-switch">
                        {mode === "register" ? "Already have an account?" : "New to ResumeAI?"}{" "}
                        <button type="button" className="auth-link" onClick={() => { setMode(mode === "register" ? "login" : "register"); setMessage(""); }}>
                            {mode === "register" ? "Sign in" : "Create account"}
                        </button>
                    </p>
                    <p className="auth-privacy">Your resume history is linked to your account. Never upload confidential resumes unless you have permission to process them.</p>
                </section>
            </main>
        );
    }

    return children;
}
