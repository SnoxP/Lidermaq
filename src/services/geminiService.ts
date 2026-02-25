import { GoogleGenAI } from "@google/genai/web";

// Polyfill for fetch if it's missing (though it should be present in modern browsers)
// We use a safe check to avoid "only a getter" errors
if (typeof window !== 'undefined' && typeof (window as any).fetch === 'undefined') {
  console.warn('Fetch not found in window, check environment.');
}

export const generateProductDescription = async (productName: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Se a chave da API não estiver configurada (ex: na Vercel), retorna a descrição padrão
    if (!apiKey || apiKey === "undefined") {
      console.warn("GEMINI_API_KEY não configurada. Usando descrição padrão.");
      return "Móvel de alta qualidade com design exclusivo Lidermaq.";
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      // @ts-ignore - Some versions of the SDK might not have this in types but it's used in implementation
      fetch: (...args: any[]) => window.fetch(...args)
    });
    
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
