require("dotenv").config();

const crypto = require("crypto");
const { promisify } = require("util");
const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { analyzeResume } = require("./services/aiService");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
const scrypt = promisify(crypto.scrypt);
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const COOKIE_NAME = "resumeai_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random secret of at least 32 characters.");
}

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "https://ai-resume-analyzer-frontend-k7sy.onrender.com",
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((value) => value.trim()) : [])
]);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error("Origin not allowed by CORS."));
    },
    credentials: true
}));
app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
    const origin = req.get("origin");
    if (origin && !allowedOrigins.has(origin)) {
        return res.status(403).json({ message: "Request origin is not allowed." });
    }
    next();
});

function parseCookies(req) {
    const header = req.headers.cookie || "";
    return Object.fromEntries(header.split(";").map((part) => {
        const separator = part.indexOf("=");
        if (separator < 0) return ["", ""];
        const key = part.slice(0, separator).trim();
        const value = part.slice(separator + 1).trim();
        try { return [key, decodeURIComponent(value)]; }
        catch { return [key, value]; }
    }).filter(([key]) => key));
}

function sign(value) {
    return crypto.createHmac("sha256", process.env.AUTH_SECRET).update(value).digest("base64url");
}

function createSessionToken(user) {
    const payload = Buffer.from(JSON.stringify({
        id: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + Math.floor(SESSION_MAX_AGE / 1000)
    })).toString("base64url");
    return payload + "." + sign(payload);
}

function verifySessionToken(token) {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const expected = Buffer.from(sign(parts[0]));
    const actual = Buffer.from(parts[1]);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
    try {
        const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
        if (!Number.isInteger(payload.id) || !payload.email || payload.exp <= Math.floor(Date.now() / 1000)) return null;
        return { id: payload.id, email: payload.email };
    } catch { return null; }
}

function setSessionCookie(res, user) {
    res.cookie(COOKIE_NAME, createSessionToken(user), {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE
    });
}

function clearSessionCookie(res) {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: "lax",
        path: "/"
    });
}

function requireAuth(req, res, next) {
    const user = verifySessionToken(parseCookies(req)[COOKIE_NAME]);
    if (!user) return res.status(401).json({ message: "Please sign in to access your account." });
    req.user = user;
    next();
}

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = await scrypt(password, salt, 64);
    return salt + ":" + derivedKey.toString("hex");
}

async function verifyPassword(password, storedHash) {
    const [salt, hashHex] = String(storedHash).split(":");
    if (!salt || !hashHex) return false;
    const stored = Buffer.from(hashHex, "hex");
    const candidate = await scrypt(password, salt, stored.length);
    return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
}

async function initializeDatabase() {
    await pool.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
    await pool.query("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE");
    console.log("Authentication schema ready. Existing unowned resumes remain inaccessible through user-scoped APIs.");
}

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf" && file.originalname.toLowerCase().endsWith(".pdf")) cb(null, true);
        else cb(new Error("Only PDF files are allowed."));
    }
});

app.get("/", (req, res) => {
    res.json({ message: "AI Resume Analyzer backend is running!" });
});

app.post("/auth/register", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long." });
    if (password.length > 128) return res.status(400).json({ message: "Password is too long." });

    try {
        const passwordHash = await hashPassword(password);
        const result = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
            [email, passwordHash]
        );
        const user = result.rows[0];
        setSessionCookie(res, user);
        return res.status(201).json({ user });
    } catch (error) {
        if (error.code === "23505") return res.status(409).json({ message: "An account with this email already exists." });
        console.error("Registration failed:", error.message);
        return res.status(500).json({ message: "Could not create your account. Please try again." });
    }
});

app.post("/auth/login", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || !password) return res.status(400).json({ message: "Enter your email and password." });

    try {
        const result = await pool.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if (!user || !(await verifyPassword(password, user.password_hash))) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        setSessionCookie(res, user);
        return res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error("Login failed:", error.message);
        return res.status(500).json({ message: "Could not sign in. Please try again." });
    }
});

app.get("/auth/me", requireAuth, (req, res) => res.json({ user: req.user }));

app.post("/auth/logout", (req, res) => {
    clearSessionCookie(res);
    res.json({ message: "Signed out successfully." });
});

app.post("/upload", requireAuth, upload.single("resume"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Please upload a PDF resume." });

    try {
        const dataBuffer = await fs.readFile(req.file.path);
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text;
        const analysis = await analyzeResume(resumeText);
        const query = "INSERT INTO resumes (user_id, filename, resume_text, analysis) VALUES ($1, $2, $3, $4) RETURNING id, filename, created_at";
        const result = await pool.query(query, [req.user.id, req.file.originalname, resumeText, analysis]);
        res.json({
            message: "Resume analyzed successfully!",
            id: result.rows[0].id,
            filename: req.file.originalname,
            text: resumeText,
            analysis
        });
    } catch (error) {
        console.error("Resume analysis failed:", error.message);
        res.status(500).json({ message: "Resume analysis failed. Please try again later." });
    } finally {
        if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    }
});

app.get("/resumes", requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, filename, resume_text, analysis, created_at FROM resumes WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Resume history error:", error.message);
        res.status(500).json({ message: "Could not fetch resume history." });
    }
});

app.get("/dashboard", requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) AS total_resumes, COALESCE(ROUND(AVG((analysis->>'score')::numeric), 0), 0) AS average_score, COALESCE((SELECT (analysis->>'score')::numeric FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1), 0) AS latest_score FROM resumes WHERE user_id = $1",
            [req.user.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Dashboard error:", error.message);
        res.status(500).json({ message: "Could not load dashboard data." });
    }
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "PDF must be 10 MB or smaller." });
    }
    if (error.message === "Only PDF files are allowed.") return res.status(400).json({ message: error.message });
    if (error.message === "Origin not allowed by CORS.") return res.status(403).json({ message: "Request origin is not allowed." });
    console.error("Unhandled server error:", error.message);
    res.status(500).json({ message: "An unexpected server error occurred." });
});

initializeDatabase()
    .then(() => app.listen(PORT, () => console.log("Server running on port " + PORT)))
    .catch((error) => {
        console.error("Could not initialize database:", error.message);
        process.exit(1);
    });
