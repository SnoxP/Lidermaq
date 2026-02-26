import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("GEMINI_API_KEY não configurada.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Escreva uma descrição curta e persuasiva para um equipamento chamado "${productName}" da loja Lidermaq. Foque em qualidade, durabilidade e eficiência para o negócio.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "Equipamento de alta qualidade com garantia Lidermaq.";
  }
};

export const identifyProductSector = async (description: string) => {
  try {
    const ai = getAI();
    const categories = ["Padarias", "Restaurantes", "Açougues", "Supermercados", "Lanchonetes", "Móveis Para Escritório"];
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Com base na seguinte descrição de produto: "${description}", identifique a qual destes setores ele pertence: ${categories.join(", ")}. Responda APENAS o nome do setor.`,
    });
    
    const identifiedSector = response.text?.trim() || "Outros";
    // Valida se o setor retornado está na lista, senão retorna o mais próximo ou "Outros"
    const validSector = categories.find(cat => identifiedSector.includes(cat)) || "Outros";
    return validSector;
  } catch (error) {
    console.error("Error identifying sector:", error);
    return "Outros";
  }
};
