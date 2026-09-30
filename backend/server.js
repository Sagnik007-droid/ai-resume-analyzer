require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { analyzeResume } = require("./services/aiService");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

//test Portgre sql
pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.error("PostgreSQL connection failed:", error);
    } else {
        console.log("PostgreSQL connection successful!");
        console.log("Database time:", result.rows[0].now);
    }
});

app.use(cors());

const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."));
        }
    }
});

//Gemini AI


app.get("/", (req, res) => {
    res.json({
        message: "AI Resume Analyzer backend is running!"
    });
});

app.post("/upload", upload.single("resume"), async (req, res) => {

    if (!req.file) {
    return res.status(400).json({
        message: "Please upload a PDF resume."
    });
}

    console.log("Resume received:", req.file.originalname);

    try {
        const fs = require("fs");
        //Read uplaoded PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        //extract text from PDF
        const data = await pdfParse(dataBuffer);

        const resumeText = data.text;

        console.log("----- EXTRACTED RESUME TEXT -----");
        console.log(resumeText);
        console.log("----- END OF RESUME TEXT -----");

        //Send resume text/prompt to AI Service

       const analysis = await analyzeResume(resumeText);

        console.log("--- AI ANALYSIS ---");
        console.log(analysis);
        console.log("---- END AI ANALYSIS ----");

        //SAving resume to portgreSQL 
        const query = `
        INSERT INTO resumes (
        filename,
        resume_text,
        analysis
        )
        VALUES ($1, $2, $3)
        RETURNING id, filename, created_at;`;

        const values = [
            req.file.originalname,
            resumeText,
            analysis
        ];

        const result = await pool.query(query, values);

        console.log("--- DATABASE RECORD CREATED ---");
        console.log(result.rows[0]);
        console.log("--- END DATABASE RECORD ---");

        //send response to frontend
        res.json({
            message: "Resume analyzed successfully!",
            filename: req.file.originalname,
            text: resumeText,
            analysis: analysis
        });

    } catch (error) {

        console.error("Resume analysis error:", error);

        res.status(500).json({
            message: "Resume uploaded, but AI analysis failed.",
            error: error.message
        });
    }
});

app.get("/resumes", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
            id,
            filename,
            resume_text,
            analysis,
            created_at
            FROM resumes
            ORDER BY created_at DESC
            `);

            res.json(result.rows);
        }
        catch (error) {
            console.error("Resume history error:", error);

            res.status(500).json({
                message: "Could not fetch resume history."
            })
    }
});

app.get("/dashboard", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) AS total_resumes,
                COALESCE(ROUND(AVG((analysis->>'score')::numeric), 0), 0) AS average_score,
                COALESCE(
                    (
                        SELECT (analysis->>'score')::numeric
                        FROM resumes
                        ORDER BY created_at DESC
                        LIMIT 1
                    ),
                    0
                ) AS latest_score
            FROM resumes
        `);

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            message: "Could not load dashboard data."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});