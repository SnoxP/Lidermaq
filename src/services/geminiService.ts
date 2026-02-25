import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Se a chave da API não estiver configurada (ex: na Vercel), retorna a descrição padrão
    if (!apiKey || apiKey === "undefined") {
      console.warn("GEMINI_API_KEY não configurada. Usando descrição padrão.");
      return "Móvel de alta qualidade com design exclusivo Lidermaq.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
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
