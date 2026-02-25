import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateProductDescription = async (productName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Escreva uma descrição curta e persuasiva para um móvel chamado "${productName}" da loja Lidermaq. Foque em qualidade, durabilidade e design.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "Móvel de alta qualidade com design exclusivo Lidermaq.";
  }
};
