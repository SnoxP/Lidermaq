import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Shield, Truck, PenTool as Tool, Star, CreditCard, Package, DollarSign, Layers, Utensils, ShoppingCart, Coffee, Briefcase, Snowflake, Settings, Store, Flame, Zap } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { SEO } from '../components/SEO';
import { db } from '../services/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

export const Home = () => {
  const { products, loading: productsLoading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const incrementViews = async () => {
      if (!db) return;
      try {
        const statsRef = doc(db, 'settings', 'stats');
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          await updateDoc(statsRef, {
            totalViews: increment(1)
          });
        } else {
          await setDoc(statsRef, { totalViews: 1 });
        }
      } catch (error) {
        console.error("Erro ao incrementar visualizações:", error);
      }
    };

    incrementViews();
  }, []);

  return (
    <div>
      <SEO />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white dark:via-zinc-950/20 dark:to-zinc-950 z-10" />
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://i.imgur.com/cU4baTN.png" 
            alt="Lidermaq Empresa" 
            className="md:hidden w-full h-full object-cover object-bottom origin-bottom"
            referrerPolicy="no-referrer"
          />
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://i.imgur.com/519GNtq.png" 
            alt="Lidermaq Empresa" 
            className="hidden md:block w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-zinc-900 dark:text-white font-display">
                EQUIPANDO O SEU <br />
                <span className="text-accent">SUCESSO.</span>
              </h1>
              <p className="text-xl md:text-2xl text-black dark:text-white mb-10 max-w-2xl leading-relaxed">
                As melhores soluções em máquinas e equipamentos para padarias, açougues, supermercados e cozinhas industriais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalogo" className="btn-primary group">
                  Ver Catálogo Completo
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="https://wa.me/5589999170800" className="btn-secondary">
                  <MessageCircle size={20} /> Solicitar Orçamento
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
        >
          <div className="w-6 h-10 border-2 border-zinc-400 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-accent rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Motivos para escolher a Lidermaq */}
      <section className="py-12 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10 dark:text-white font-display">MOTIVOS PARA ESCOLHER A <span className="text-accent">LIDERMAQ</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center"><Star size={24} /></div>
              <span className="text-sm font-bold dark:text-white uppercase tracking-wider">+ DE 40 ANOS DE TRADIÇÃO</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center"><Shield size={24} /></div>
              <span className="text-sm font-bold dark:text-white uppercase tracking-wider">FOCO NA SUA SATISFAÇÃO</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center"><CreditCard size={24} /></div>
              <span className="text-sm font-bold dark:text-white uppercase tracking-wider">FACILIDADE NO PAGAMENTO</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center"><Package size={24} /></div>
              <span className="text-sm font-bold dark:text-white uppercase tracking-wider">PRODUTOS À PRONTA-ENTREGA</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center"><DollarSign size={24} /></div>
              <span className="text-sm font-bold dark:text-white uppercase tracking-wider">PREÇO JUSTO</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center"><Layers size={24} /></div>
              <span className="text-sm font-bold dark:text-white uppercase tracking-wider">VARIEDADE DE ITENS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 dark:text-white font-display">CATEGORIAS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Refrigeração Comercial', icon: Snowflake, query: 'refrigeracao' },
              { name: 'Maquinário de Produção', icon: Settings, query: 'maquina' },
              { name: 'Expositores de Alimentos', icon: Store, query: 'expositor' },
              { name: 'Equipamentos para Cocção', icon: Flame, query: 'fogao' },
              { name: 'Portáteis Industriais', icon: Zap, query: 'liquidificador' },
              { name: 'Mobiliário Comercial', icon: Briefcase, query: 'mesa' }
            ].map((cat, i) => (
              <Link key={i} to={`/catalogo?q=${cat.query}`} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-accent group-hover:text-white transition-colors">
                  <cat.icon size={32} />
                </div>
                <span className="font-bold text-sm dark:text-white">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Segmentos */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 dark:text-white font-display">SEGMENTOS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Açougues', icon: Flame, img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400&h=400&auto=format&fit=crop' },
              { name: 'Lanchonetes', icon: Coffee, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&h=400&auto=format&fit=crop' },
              { name: 'Padarias', icon: Utensils, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&h=400&auto=format&fit=crop' },
              { name: 'Restaurantes', icon: Utensils, img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&h=400&auto=format&fit=crop' },
              { name: 'Supermercados', icon: ShoppingCart, img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400&h=400&auto=format&fit=crop' },
              { name: 'Móveis Para Escritório', icon: Briefcase, img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&h=400&auto=format&fit=crop' }
            ].map((seg, i) => (
              <Link key={i} to={`/catalogo?cat=${seg.name}`} className="relative overflow-hidden rounded-2xl aspect-square group">
                <div className="absolute inset-0 bg-zinc-900/60 group-hover:bg-zinc-900/40 transition-colors z-10" />
                <img src={seg.img} alt={seg.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-4 text-center">
                  <seg.icon size={32} className="mb-3 opacity-80" />
                  <span className="font-bold text-lg leading-tight">{seg.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pt-20 pb-6 md:pb-12 bg-neutral-bg dark:bg-neutral-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">Destaques</span>
              <h2 className="text-4xl font-black tracking-tighter dark:text-white">LINHAS EM EVIDÊNCIA</h2>
            </div>
            <Link to="/catalogo" className="text-primary dark:text-white font-bold flex items-center gap-2 hover:text-accent transition-colors group">
              Ver catálogo completo <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {productsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-3xl animate-pulse" />
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} gridCols={2} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-12 dark:text-white font-display">TRABALHAMOS COM AS MELHORES MARCAS</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['GELOPAR', 'VENÂNCIO', 'METVISA', 'SKYSEN', 'PROGÁS', 'BRAESI'].map((brand, i) => (
              <span key={i} className="text-2xl md:text-4xl font-black text-zinc-800 dark:text-zinc-200 tracking-widest">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-20 pb-20 bg-neutral-bg dark:bg-neutral-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative block rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/5 bg-zinc-900 max-w-5xl mx-auto"
          >
            <Link to="/produto/1QEP7nmIfy8w5WfhApeA" className="block w-full h-full">
              <img 
                src="https://i.ibb.co/q2j76FQ/Cn-P-13032026-203914.png" 
                alt="Assistência Técnica Lidermaq" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">FIQUE POR DENTRO DAS NOVIDADES</h2>
          <p className="text-white/80 mb-10 max-w-2xl mx-auto">Assine nossa newsletter e receba ofertas exclusivas e dicas de decoração diretamente no seu e-mail.</p>
          <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
              required
            />
            <button type="submit" className="bg-white text-accent px-10 py-4 rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
              Assinar Agora
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
