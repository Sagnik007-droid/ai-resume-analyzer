# AI Resume Analyzer

An AI-powered full-stack web application that analyzes resumes, generates an overall resume score, identifies strengths and weaknesses, extracts technical skills and ATS keywords, and provides personalized improvement suggestions.

## 🚀 Live Demo

https://ai-resume-analyzer-frontend-k7sy.onrender.com

## 📌 Features

- 📄 Upload PDF resumes
- 🤖 AI-powered resume analysis
- 📊 Resume score and score breakdown
- 💪 Identify resume strengths
- ⚠️ Identify areas for improvement
- 🛠️ Extract technical skills
- 🔎 Identify ATS keywords
- 💼 Suggest suitable job roles
- 📚 Resume analysis history
- 📈 Dashboard with resume statistics
- 🗄️ PostgreSQL database storage
- 🌐 Deployed frontend and backend

## 🔐 Account Security

- Email/password registration and sign-in.
- Passwords are stored as salted scrypt hashes, not plaintext.
- HTTP-only signed session cookies protect resume upload, history, and dashboard API routes.
- Each resume is associated with its owner; history and dashboard queries are filtered by the signed-in user's ID.
- Existing resume rows are not automatically assigned to any account. They remain hidden until deliberately reviewed and migrated by the database owner.
- Configure `AUTH_SECRET` (at least 32 random characters), `DATABASE_URL`, `NODE_ENV=production`, and `FRONTEND_URL` in the backend environment. Set `VITE_API_URL` in the frontend environment if your backend URL differs from the default.
- Never commit real API keys, database credentials, or `.env` files.

## 🎯 Project Objective

To help job seekers understand their resume's strengths, identify improvement opportunities, and better prepare their resumes for Applicant Tracking Systems (ATS).

## 👨‍💻 Developer

Sagnik Manna

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- React Router

### Backend

- Node.js
- Express.js
- Multer
- PDF parsing
- REST API

### Database

- PostgreSQL
- Neon PostgreSQL

### AI

- Gemini API
- OpenRouter API
- NVIDIA API integration

### Deployment

- Render
- Neon

## 🏗️ Project Architecture

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP Request
 ▼
Express Backend
 │
 ├── PDF Text Extraction
 │
 ├── AI Resume Analysis
 │
 └── PostgreSQL
        │
        ▼
   Resume History

   ## 🔐 Environment Variables

The backend requires environment variables for database and AI provider configuration.

Example:

```env
DATABASE_URL=your_database_connection_string

GEMINI_API_KEY=your_gemini_api_key
NVIDIA_API_KEY=your_nvidia_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
