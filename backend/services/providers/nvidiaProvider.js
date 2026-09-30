const OpenAI = require("openai");

const nvidia = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
});

async function analyzeWithNvidia(resumeText) {
    const response = await nvidia.chat.completions.create({
        model: "deepseek-ai/deepseek-v4-flash",

        messages: [
            {
                role: "system",
                content: `
You are an AI resume analyzer.

Analyze the resume and return ONLY valid JSON.

Use exactly this structure:

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

- score must be between 0 and 100.
- matchScore must be between 0 and 100.
- strengths, weaknesses, skills and improvements must be arrays.
- Only include skills actually demonstrated in the resume.
- Do not invent qualifications, experience or skills.
- jobRoles must be suitable entry-level roles based only on the resume.
- Do not use the same matchScore for every role.
- Return JSON only.
- Do not use Markdown.
- Do not use code fences.
`
            },
            {
                role: "user",
                content: `Analyze this resume:\n\n${resumeText}`
            }
        ],

        temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content);
}

module.exports = {
    analyzeWithNvidia
};