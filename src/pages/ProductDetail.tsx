import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Truck, PenTool as Tool, ArrowLeft, Check, Share2 } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { generateProductDescription } from '../services/geminiService';

export const ProductDetail = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (product) {
      setLoadingAi(true);
      generateProductDescription(product.name).then(desc => {
        setAiDescription(desc || null);
        setLoadingAi(false);
      });
    }
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/catalogo" className="btn-primary inline-flex">Voltar ao Catálogo</Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/558999999999?text=${encodeURIComponent(`Olá, tenho interesse no produto: ${product.name} - Lidermaq`)}`;

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-neutral-bg border border-neutral-bg"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-neutral-bg border border-neutral-bg cursor-pointer hover:border-accent transition-all">
                  <img src={`https://picsum.photos/seed/prod-${i}/400/400`} alt="Thumb" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Check size={14} /> Em estoque
                </span>
              </div>
              <p className="text-xl font-semibold text-accent mb-6">{product.installments}</p>
              
              <div className="p-6 bg-neutral-bg rounded-2xl mb-8">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Descrição do Especialista
                </h3>
                <p className="text-primary/70 leading-relaxed">
                  {loadingAi ? "Gerando descrição detalhada..." : (aiDescription || product.description)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href={whatsappUrl} className="btn-primary flex-1 text-lg py-4">
                  <MessageCircle size={24} /> Pedir pelo WhatsApp
                </a>
                <button className="btn-secondary px-6">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-bg">
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60">
                  <Shield size={20} className="text-accent" /> Garantia de 1 Ano
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60">
                  <Truck size={20} className="text-accent" /> Entrega em Picos/PI
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60">
                  <Tool size={20} className="text-accent" /> Montagem Inclusa
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60">
                  <Check size={20} className="text-accent" /> Selo de Qualidade
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-black tracking-tighter mb-8">ESPECIFICAÇÕES TÉCNICAS</h2>
          <div className="bg-white border border-neutral-bg rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-neutral-bg">
                  <th className="p-6 bg-neutral-bg/50 font-bold w-1/3">Medidas (LxPxA)</th>
                  <td className="p-6">{product.specs.dimensions}</td>
                </tr>
                <tr className="border-b border-neutral-bg">
                  <th className="p-6 bg-neutral-bg/50 font-bold">Peso Aproximado</th>
                  <td className="p-6">{product.specs.weight}</td>
                </tr>
                <tr className="border-b border-neutral-bg">
                  <th className="p-6 bg-neutral-bg/50 font-bold">Material da Estrutura</th>
                  <td className="p-6">{product.specs.material}</td>
                </tr>
                <tr>
                  <th className="p-6 bg-neutral-bg/50 font-bold">Acabamento</th>
                  <td className="p-6">{product.specs.finish}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
