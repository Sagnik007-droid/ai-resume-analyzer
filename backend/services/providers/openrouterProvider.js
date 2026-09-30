const OpenAI = require("openai");

const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

async function analyzeWithOpenRouter(resumeText) {
    const response = await openrouter.chat.completions.create({
        model: "openai/gpt-4o-mini",

        messages: [
            {
                role: "system",
                content: `
You are an AI resume analyzer.

Analyze the resume carefully and return ONLY valid JSON.

Use exactly this structure:

{
    "score": 0,

    "scoreBreakdown": {
        "skills": 0,
        "experience": 0,
        "projects": 0,
        "formatting": 0,
        "atsCompatibility": 0
    },

    "strengths": [],

    "weaknesses": [],

    "skills": [],

    "atsKeywords": {
        "detected": [],
        "suggested": []
    },

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
- Every scoreBreakdown value must be a number between 0 and 100.
- strengths must be an array of short strings.
- weaknesses must be an array of short strings.
- skills must contain only technical or professional skills actually demonstrated in the resume.
- atsKeywords.detected must contain keywords actually found in the resume.
- atsKeywords.suggested must contain relevant keywords that could improve the resume based on the demonstrated experience and target roles.
- improvements must be practical and specific to the resume.
- jobRoles must contain suitable entry-level roles based only on the resume.
- Each job role must contain all required fields.
- matchScore must be a number between 0 and 100.
- Do not use the same matchScore for every role.
- matchingSkills must contain only skills actually present in the resume.
- skillsToStrengthen should contain relevant skills useful for that role but not clearly demonstrated in the resume.
- nextSteps must be practical and specific to the role.
- Do not invent qualifications, experience, projects or skills.
- Do not assume skills that are not demonstrated.
- Keep all recommendations realistic for an entry-level candidate.
- Return JSON only.
- Do not use Markdown.
- Do not use code fences.
- Do not include explanations outside the JSON.
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
    analyzeWithOpenRouter
};