import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Shield, Truck, PenTool as Tool } from 'lucide-react';
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
    <div className="pt-20">
      <SEO />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-white dark:via-zinc-950/50 dark:to-zinc-950 z-10" />
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://cidadesnanet.com/news/wp-content/uploads/2020/12/IMG_8267.jpg" 
            alt="Lidermaq Empresa" 
            className="w-full h-full object-cover"
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
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-bold uppercase tracking-[0.3em] rounded-full mb-6 border border-accent/20">
                Líder em Equipamentos Comerciais
              </span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-gradient font-display">
                EQUIPANDO O SEU <br />
                <span className="text-accent">SUCESSO.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
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

      {/* Features Section - Bento Grid Style */}
      <section className="section-padding bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 dark:text-white font-display">
                POR QUE ESCOLHER A <br />
                <span className="text-accent">LIDERMAQ?</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Combinamos tecnologia de ponta com um atendimento humano e especializado para garantir o melhor para o seu negócio.
              </p>
            </div>
            <Link to="/sobre" className="text-accent font-bold flex items-center gap-2 hover:underline group">
              Conheça nossa história <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Main Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 md:row-span-2 card-premium p-10 flex flex-col justify-between bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950"
            >
              <div>
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8">
                  <Shield size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 dark:text-white font-display">QUALIDADE <br />GARANTIDA</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Trabalhamos apenas com as melhores marcas do mercado, garantindo durabilidade e alta performance para seus equipamentos.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-white/5">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                    +15k
                  </div>
                </div>
                <p className="text-xs font-bold text-zinc-400 mt-3 uppercase tracking-widest">Clientes satisfeitos em todo o Piauí</p>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 card-premium p-10 flex items-center gap-8 bg-zinc-900 text-white"
            >
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-accent shrink-0">
                <Tool size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 font-display">SUPORTE TÉCNICO</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Equipe especializada pronta para atender você com agilidade e peças originais.
                </p>
              </div>
            </motion.div>

            {/* Delivery */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="card-premium p-8 bg-white dark:bg-zinc-900"
            >
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 dark:text-white font-display">ENTREGA RÁPIDA</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Logística própria para garantir que seu equipamento chegue seguro.
              </p>
            </motion.div>

            {/* Consulting */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="card-premium p-8 bg-white dark:bg-zinc-900"
            >
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 dark:text-white font-display">MONTAGEM</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Instalação completa e profissional no seu estabelecimento.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-neutral-bg dark:bg-neutral-800 transition-colors duration-300">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-3xl animate-pulse" />
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Institutional Block */}
      <section className="py-20 bg-white dark:bg-neutral-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[450px] rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 flex">
                <div className="w-full md:w-1/2 h-full overflow-hidden">
                  <img 
                    src="https://instagram.fpcs1-1.fna.fbcdn.net/v/t51.82787-15/620411273_18146125075456641_4993748442091467742_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzgxNDMwOTY2NjUwODMzNjU3OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEyMDB4MTYwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=675IQzFTHbsQ7kNvwFhu6l9&_nc_oc=Adl-wzX8K8w18AfmjAhw8rYAy_wc9dz_eYzBJ011UOOKa8xaW1uULZ6n5dnPzHCwi3f0U2ep2Q0G42D0BfJY8ksL&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fpcs1-1.fna&_nc_gid=iUlULu96D3mN5gx8kZntcg&_nc_ss=8&oh=00_AfuXXnC6ek3SeufqkW8nVLxL0_03Ssc9e_QW2TIEaszRlA&oe=69A8C392" 
                    alt="Prateleiras" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="hidden md:block md:w-1/2 h-full overflow-hidden">
                  <img 
                    src="https://instagram.fpcs1-1.fna.fbcdn.net/v/t51.82787-15/619239102_18146114566456641_4781227247150010144_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=MzgxNDIzNzA1NjQ0NTUzMTg2Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEyMDB4MTYwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=A8d1Ln1vcBgQ7kNvwGzPw7j&_nc_oc=AdmJf0duO_l_ze5x1vI5g7HCLHGm7wEGEOs8NQWO12XLWJfJHMn4xTK430zjiq83jXbakPHfN9ZaZqsFwj_I2MJY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fpcs1-1.fna&_nc_gid=iUlULu96D3mN5gx8kZntcg&_nc_ss=8&oh=00_Afs4e_tZwMgIiJxjTCzfmYwPjGUrVpeMZCmyvj0jkQDZAA&oe=69A8C470" 
                    alt="Freezers" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent p-6 md:p-12 flex flex-col justify-end">
                <div className="max-w-lg">
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">ASSISTÊNCIA TÉCNICA</h3>
                  <p className="text-white/90 text-lg mb-8 leading-relaxed">Suporte especializado para seus equipamentos Lidermaq, garantindo vida longa ao seu investimento.</p>
                  <Link to="/assistencia" className="btn-primary w-fit px-10 py-4 text-lg">Acessar Suporte</Link>
                </div>
              </div>
            </div>
          </div>
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
