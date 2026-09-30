const { GoogleGenAI } = require("@google/genai");

async function testAI() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: "Reply with exactly: AI connection is working!",
        });

        console.log("----- AI RESPONSE -----");
        console.log(response.text);
        console.log("----- END -----");

    } catch (error) {
        console.error("AI connection failed:");
        console.error(error.message);
    }
}

testAI();