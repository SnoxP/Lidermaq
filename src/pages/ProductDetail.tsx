import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Truck, PenTool as Tool, ArrowLeft, Check, Share2 } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SEO } from '../components/SEO';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          setMainImage(data.images?.[0] || data.image || '');
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (selectedVariant?.image) {
      setMainImage(selectedVariant.image);
    } else if (product) {
      setMainImage(product.images?.[0] || product.image || '');
    }
  }, [selectedVariant, product]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center animate-pulse">
        <div className="w-20 h-20 bg-neutral-bg dark:bg-neutral-800 rounded-full mx-auto mb-4" />
        <p className="text-primary/40 dark:text-white/40 font-bold">Carregando detalhes...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/catalogo" className="btn-primary inline-flex">Voltar ao Catálogo</Link>
      </div>
    );
  }

  const productImage = mainImage || product.images?.[0] || product.image || 'https://picsum.photos/seed/lidermaq/800/800';
  const productPrice = selectedVariant?.price || product.price || 0;
  const productName = selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name;
  const productDescription = selectedVariant?.description || product.description || 'Sem descrição disponível para este produto.';
  const whatsappUrl = `https://wa.me/5589999170800?text=${encodeURIComponent(`Olá, tenho interesse no produto: ${productName} - Lidermaq`)}`;

  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO 
        title={product.name || 'Produto Lidermaq'}
        description={product.description?.substring(0, 160) || 'Confira este produto na Lidermaq.'}
        image={productImage}
      />
      <div className="container mx-auto px-4">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-zinc-500 hover:text-accent font-bold mb-8 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 shadow-sm"
            >
              <img src={productImage} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border-2 cursor-pointer transition-all ${mainImage === img ? 'border-accent shadow-md shadow-accent/20' : 'border-zinc-200 dark:border-white/5 hover:border-accent/30'}`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-accent font-bold uppercase tracking-widest text-[10px] bg-accent/10 px-3 py-1 rounded-full">{product.category || 'Geral'}</span>
                <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px]">{product.brand || 'Lidermaq'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 dark:text-white font-display">{product.name || 'Produto sem nome'}</h1>
              
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">Selecione o Modelo</label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedVariant(null)}
                      className={`px-5 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${!selectedVariant ? 'border-accent bg-accent/5 text-accent shadow-sm' : 'border-zinc-200 dark:border-white/10 hover:border-accent/30 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900'}`}
                    >
                      {!selectedVariant || product.name.length <= 20 
                        ? product.name 
                        : `${product.name.substring(0, 20)}...`}
                    </button>
                    {product.variants.map((v: any, i: number) => {
                      const isActive = selectedVariant === v;
                      return (
                        <button 
                          key={i}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-5 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${isActive ? 'border-accent bg-accent/5 text-accent shadow-sm' : 'border-zinc-200 dark:border-white/10 hover:border-accent/30 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900'}`}
                        >
                          {isActive || v.name.length <= 20 
                            ? v.name 
                            : `${v.name.substring(0, 20)}...`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-black text-zinc-900 dark:text-white font-display">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(productPrice)}
                  </span>
                  <span className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/50">
                    <Check size={14} /> Em estoque
                  </span>
                </div>
                <span className="text-accent font-bold text-sm">
                  {product.installments || 'Consulte condições'}
                </span>
              </div>
              
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] mb-8 transition-colors duration-300 border border-zinc-200 dark:border-white/5 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white font-display text-lg">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Descrição do Produto
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                  {productDescription}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href={whatsappUrl} className="btn-primary flex-1 text-lg py-4 shadow-lg shadow-accent/20 flex items-center justify-center gap-2">
                  <MessageCircle size={24} /> Pedir pelo WhatsApp
                </a>
                <button 
                  onClick={() => {
                    navigator.share?.({
                      title: product.name,
                      text: product.description,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copiado para a área de transferência!');
                    });
                  }}
                  className="btn-secondary px-6 flex items-center justify-center"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-zinc-200 dark:border-white/10">
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Shield size={20} />
                  </div>
                  Garantia de 1 Ano
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Truck size={20} />
                  </div>
                  Entrega em Picos/PI
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Tool size={20} />
                  </div>
                  Montagem Inclusa
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Check size={20} />
                  </div>
                  Selo de Qualidade
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        {product.specs && (
          <div className="mt-24">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 dark:text-white font-display">ESPECIFICAÇÕES TÉCNICAS</h2>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[2rem] overflow-hidden transition-colors duration-300 shadow-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {product.specs.dimensions && (
                    <tr className="border-b border-zinc-200 dark:border-white/5">
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold w-1/3 dark:text-white">Medidas (LxPxA)</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.dimensions}</td>
                    </tr>
                  )}
                  {product.specs.weight && (
                    <tr className="border-b border-zinc-200 dark:border-white/5">
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold dark:text-white">Peso Aproximado</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.weight}</td>
                    </tr>
                  )}
                  {product.specs.material && (
                    <tr className="border-b border-zinc-200 dark:border-white/5">
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold dark:text-white">Material da Estrutura</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.material}</td>
                    </tr>
                  )}
                  {product.specs.finish && (
                    <tr>
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold dark:text-white">Acabamento</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.finish}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
