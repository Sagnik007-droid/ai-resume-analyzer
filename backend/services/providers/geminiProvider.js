const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function analyzeWithGemini(resumeText) {
    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",

        config: {
            thinkingConfig: {
                thinkingLevel: "low"
            }
        },

        contents: `
You are an AI resume analyzer.

Analyze the following resume.

Resume:
${resumeText}

Return ONLY valid JSON.

The JSON must follow exactly this structure:

{
    "score": 0,
    "strengths": [],
    "weaknesses": [],
    "skills": [],
    "improvements": [],
    "jobRoles": [
        {
            "role": "",
            "matchScore": 0,
            "description": "",
            "whyItMatches": "",
            "matchingSkills": [],
            "skillsToStrengthen": [],
            "nextSteps": []
        }
    ]
}

Rules:

- score must be a number between 0 and 100.
- strengths must be an array of short strings.
- weaknesses must be an array of short strings.
- skills must contain technical skills actually found in the resume.
- improvements must be practical and relevant to the resume.
- jobRoles must be suitable entry-level job roles based only on the resume.
- Each job role must contain all required fields.
- matchScore must be a number between 0 and 100.
- matchScore must be based only on skills, education, projects and experience present in the resume.
- Do not use the same matchScore for every role.
- matchingSkills must contain only skills actually present in the resume.
- skillsToStrengthen should contain relevant skills useful for the role but not clearly demonstrated in the resume.
- nextSteps must be practical and relevant to the specific role.
- Do not invent qualifications, experience or skills.
- Do not include Markdown.
- Do not include code fences.
- Do not include any text before or after the JSON.
`
    });

    return JSON.parse(response.text);
}

module.exports = {
    analyzeWithGemini
};