import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { identifyProductSector } from '../services/geminiService';

interface PendingProduct {
  id: number;
  description: string;
  image: string | null;
  identifiedSector: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export const AdminSimulator = () => {
  const [inputLines, setInputLines] = useState('');
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    const lines = inputLines.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return;

    setIsProcessing(true);
    const newProducts: PendingProduct[] = lines.map((line, index) => ({
      id: Date.now() + index,
      description: line,
      image: `https://picsum.photos/seed/${index}/400/300`, // Simulated image for each verse
      identifiedSector: null,
      status: 'processing'
    }));

    setPendingProducts(newProducts);

    for (let i = 0; i < newProducts.length; i++) {
      try {
        const sector = await identifyProductSector(newProducts[i].description);
        setPendingProducts(prev => prev.map(p => 
          p.id === newProducts[i].id 
            ? { ...p, identifiedSector: sector, status: 'completed' } 
            : p
        ));
      } catch (error) {
        setPendingProducts(prev => prev.map(p => 
          p.id === newProducts[i].id 
            ? { ...p, status: 'error' } 
            : p
        ));
      }
    }
    setIsProcessing(false);
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">Simulador de Cadastro Inteligente</h1>
          <p className="text-primary/60 max-w-2xl">
            Insira as descrições dos produtos (uma por linha). A IA identificará automaticamente o setor correto para cada item e associará uma imagem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Area */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-neutral-bg shadow-sm">
              <label className="block text-sm font-bold uppercase tracking-widest mb-4">Descrições dos Produtos (Versos)</label>
              <textarea 
                value={inputLines}
                onChange={(e) => setInputLines(e.target.value)}
                placeholder="Ex: Forno industrial de 8 esteiras para pães franceses...&#10;Balcão expositor refrigerado para carnes e cortes nobres...&#10;Cadeira ergonômica com ajuste de altura e braços..."
                className="w-full h-64 p-6 bg-neutral-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none font-medium"
              />
              <button 
                onClick={handleProcess}
                disabled={isProcessing || !inputLines.trim()}
                className="btn-primary w-full mt-6 py-4 text-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processando...
                  </>
                ) : (
                  <>
                    <Upload size={20} /> Processar Lote
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold uppercase tracking-tighter">Resultados da Identificação</h2>
              <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">
                {pendingProducts.length} itens processados
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {pendingProducts.length === 0 ? (
                <div className="py-20 text-center bg-neutral-bg rounded-3xl border border-dashed border-primary/10">
                  <Search className="mx-auto text-primary/20 mb-4" size={48} />
                  <p className="text-primary/40 font-bold">Aguardando entrada de dados...</p>
                </div>
              ) : (
                pendingProducts.map((product) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={product.id}
                    className="bg-white p-6 rounded-2xl border border-neutral-bg flex gap-6 items-center shadow-sm"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-bg">
                      {product.image ? (
                        <img src={product.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary line-clamp-2 mb-2 italic">
                        "{product.description}"
                      </p>
                      <div className="flex items-center gap-3">
                        {product.status === 'processing' ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest">
                            <Loader2 className="animate-spin" size={12} /> Identificando Setor...
                          </span>
                        ) : product.status === 'completed' ? (
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                              {product.identifiedSector}
                            </span>
                            <CheckCircle size={14} className="text-emerald-500" />
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            <AlertCircle size={12} /> Erro ao identificar
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
