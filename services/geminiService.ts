
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFruitInsight = async (fruitName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a very short, one-sentence fun nutritional fact or tip for a ${fruitName}. Keep it professional but engaging.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      },
    });
    return response.text || "Fresh and nutritious fruit for your health!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "High quality fresh fruit selection.";
  }
};

export const searchFruitsAI = async (query: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `The user is searching for "${query}" in a fruit market. Return a JSON array of fruit names that might match this intent from our catalog (Red Apple, Fresh Mango, Cavendish Banana, Organic Strawberries, Green Kiwi, Purple Grapes).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        return [];
    }
}
