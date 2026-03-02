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
    <div className="pt-32 pb-20">
      <SEO 
        title={product.name || 'Produto Lidermaq'}
        description={product.description?.substring(0, 160) || 'Confira este produto na Lidermaq.'}
        image={productImage}
      />
      <div className="container mx-auto px-4">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-primary/60 dark:text-white/60 hover:text-accent font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-neutral-bg dark:bg-neutral-800 border border-neutral-bg dark:border-white/5"
            >
              <img src={productImage} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden bg-neutral-bg dark:bg-neutral-800 border-2 cursor-pointer transition-all ${mainImage === img ? 'border-accent' : 'border-neutral-bg dark:border-white/5 hover:border-accent/30'}`}
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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-accent font-bold uppercase tracking-widest text-sm">{product.category || 'Geral'}</span>
                <span className="w-1 h-1 bg-primary/20 dark:bg-white/20 rounded-full" />
                <span className="text-primary/40 dark:text-white/40 font-bold uppercase tracking-widest text-sm">{product.brand || 'Lidermaq'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 dark:text-white">{product.name || 'Produto sem nome'}</h1>
              
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-white/40 mb-2">Selecione o Modelo</label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedVariant(null)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all font-bold text-sm ${!selectedVariant ? 'border-accent bg-accent/5 text-accent' : 'border-neutral-bg dark:border-white/10 hover:border-accent/30'}`}
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
                          className={`px-4 py-2 rounded-xl border-2 transition-all font-bold text-sm ${isActive ? 'border-accent bg-accent/5 text-accent' : 'border-neutral-bg dark:border-white/10 hover:border-accent/30'}`}
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

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(productPrice)}
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Check size={14} /> Em estoque
                </span>
              </div>
              
              <div className="p-6 bg-neutral-bg dark:bg-neutral-800 rounded-2xl mb-8 transition-colors duration-300">
                <h3 className="font-bold mb-3 flex items-center gap-2 dark:text-white">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Descrição do Produto
                </h3>
                <p className="text-primary/70 dark:text-white/70 leading-relaxed whitespace-pre-line">
                  {productDescription}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href={whatsappUrl} className="btn-primary flex-1 text-lg py-4">
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
                  className="btn-secondary px-6"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-bg dark:border-white/10">
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60 dark:text-white/60">
                  <Shield size={20} className="text-accent" /> Garantia de 1 Ano
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60 dark:text-white/60">
                  <Truck size={20} className="text-accent" /> Entrega em Picos/PI
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60 dark:text-white/60">
                  <Tool size={20} className="text-accent" /> Montagem Inclusa
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary/60 dark:text-white/60">
                  <Check size={20} className="text-accent" /> Selo de Qualidade
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        {product.specs && (
          <div className="mt-20">
            <h2 className="text-3xl font-black tracking-tighter mb-8 dark:text-white">ESPECIFICAÇÕES TÉCNICAS</h2>
            <div className="bg-white dark:bg-neutral-800 border border-neutral-bg dark:border-white/5 rounded-3xl overflow-hidden transition-colors duration-300">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {product.specs.dimensions && (
                    <tr className="border-b border-neutral-bg dark:border-white/5">
                      <th className="p-6 bg-neutral-bg/50 dark:bg-neutral-700 font-bold w-1/3 dark:text-white">Medidas (LxPxA)</th>
                      <td className="p-6 dark:text-white/80">{product.specs.dimensions}</td>
                    </tr>
                  )}
                  {product.specs.weight && (
                    <tr className="border-b border-neutral-bg dark:border-white/5">
                      <th className="p-6 bg-neutral-bg/50 dark:bg-neutral-700 font-bold dark:text-white">Peso Aproximado</th>
                      <td className="p-6 dark:text-white/80">{product.specs.weight}</td>
                    </tr>
                  )}
                  {product.specs.material && (
                    <tr className="border-b border-neutral-bg dark:border-white/5">
                      <th className="p-6 bg-neutral-bg/50 dark:bg-neutral-700 font-bold dark:text-white">Material da Estrutura</th>
                      <td className="p-6 dark:text-white/80">{product.specs.material}</td>
                    </tr>
                  )}
                  {product.specs.finish && (
                    <tr>
                      <th className="p-6 bg-neutral-bg/50 dark:bg-neutral-700 font-bold dark:text-white">Acabamento</th>
                      <td className="p-6 dark:text-white/80">{product.specs.finish}</td>
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
