const USE_MOCK_AI = false;

const { analyzeWithGemini } = require("./providers/geminiProvider");
const { analyzeWithNvidia } = require("./providers/nvidiaProvider");
const { analyzeWithOpenRouter } = require("./providers/openrouterProvider");

async function analyzeResume(resumeText) {

    // MOCK AI

    if (USE_MOCK_AI) {
        return {
            score: 62,

            strengths: [
                "Strong academic background",
                "Good foundation in HTML, CSS and JavaScript",
                "Experience with SQL and DBMS",
                "Practical academic projects"
            ],

            weaknesses: [
                "Add more advanced full-stack projects",
                "Improve technical project depth",
                "Add modern frameworks such as React and Node.js",
                "Reduce unnecessary resume content"
            ],

            skills: [
                "HTML5",
                "CSS3",
                "JavaScript",
                "Java",
                "Python",
                "SQL",
                "DBMS",
                "Android Studio"
            ],

            improvements: [
                "Build full-stack applications",
                "Add API integration",
                "Add GitHub repositories",
                "Add measurable project achievements"
            ],

            jobRoles: [
                {
                    role: "Junior Frontend Developer",
                    matchScore: 78,
                    description: "Entry-level role focused on building web interfaces.",
                    whyItMatches: "The resume demonstrates HTML, CSS and JavaScript knowledge.",
                    matchingSkills: [
                        "HTML5",
                        "CSS3",
                        "JavaScript"
                    ],
                    skillsToStrengthen: [
                        "React",
                        "Git",
                        "REST APIs"
                    ],
                    nextSteps: [
                        "Build a React project",
                        "Create a GitHub portfolio",
                        "Practice REST API integration"
                    ]
                }
            ]
        };
    }

    // GEMINI

    try {

        console.log("Trying Gemini...");

        const result = await analyzeWithGemini(resumeText);

        console.log("Gemini analysis successful.");

        return result;

    } catch (error) {

        console.error(
            "Gemini failed:",
            error.message
        );

    }

    // NVIDIA

    try {

        console.log("Trying NVIDIA...");

        const result = await analyzeWithNvidia(resumeText);

        console.log("NVIDIA analysis successful.");

        return result;

    } catch (error) {

        console.error(
            "NVIDIA failed:",
            error.message
        );

    }

    // OPENROUTER

    try {

        console.log("Trying OpenRouter...");

        const result = await analyzeWithOpenRouter(resumeText);

        console.log("OpenRouter analysis successful.");

        return result;

    } catch (error) {

        console.error(
            "OpenRouter failed:",
            error.message
        );

    }

    // ALL PROVIDERS FAILED

    throw new Error(
        "All AI providers are currently unavailable. Please try again later."
    );
}


module.exports = {
    analyzeResume
};