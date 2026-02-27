import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("GEMINI_API_KEY não configurada.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateOrImproveDescription = async (name: string, brand: string, existingDescription?: string) => {
  try {
    const ai = getAI();
    let prompt = "";
    
    if (existingDescription && existingDescription.trim().length > 10) {
      prompt = `Melhore e profissionalize a seguinte descrição de produto para a loja Lidermaq: "${existingDescription}". 
      O produto é "${name}" da marca "${brand}". 
      Mantenha um tom persuasivo, técnico e focado em benefícios para o cliente industrial/comercial. 
      Retorne APENAS o texto da nova descrição melhorada.`;
    } else {
      prompt = `Escreva uma descrição profissional, persuasiva e vendedora para o seguinte produto: "${name}" da marca "${brand}". 
      Destaque a qualidade, durabilidade e eficiência para uso comercial/industrial na loja Lidermaq. 
      Retorne APENAS o texto da descrição.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating/improving description:", error);
    return null;
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
