const API_KEY = process.env.API_KEY;
const model = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = "You are an emergency response advisor. Provide clear, concise, and step-by-step instructions. Your tone should be calm and reassuring. Start with a critical safety warning if applicable. Do not provide medical advice that should come from a doctor, but you can provide standard first-aid procedures. Add a disclaimer at the end: 'This is not a substitute for professional medical advice. Always call emergency services in a life-threatening situation.'";

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

export const getAIResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "AI service is currently unavailable. Please configure the API key.";
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === 'string' && text.trim()
      ? text
      : "Sorry, I couldn't generate a response right now.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't get a response. Please check your connection or API key.";
  }
};
