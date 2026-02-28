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
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/lidermaq-hero/1280/720" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-accent text-white text-xs font-bold uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-6">
              Qualidade & Tradição
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.9] mb-6 tracking-tighter">
              <span className="block mb-2">MÁQUINAS E</span>
              <span className="block mb-4">EQUIPAMENTOS DE</span>
              <span className="text-accent text-2xl md:text-4xl block leading-tight">PADARIAS, RESTAURANTES, AÇOUGUES, SUPERMERCADOS, LANCHONETES E MÓVEIS PARA ESCRITÓRIO.</span>
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Equipamentos de alta performance, durabilidade e a garantia de quem entende do seu negócio há mais de 30 anos. Potencialize sua empresa com a Lidermaq.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalogo" className="btn-primary text-lg px-10">
                Ver Catálogo <ArrowRight size={20} />
              </Link>
              <a href="https://wa.me/5589999170800" className="btn-secondary border-white text-white hover:bg-white hover:text-primary text-lg px-10">
                <MessageCircle size={20} /> Pedir Orçamento
              </a>
            </div>

            <div className="mt-16 flex flex-wrap gap-8">
              {['Padarias', 'Restaurantes', 'Açougues', 'Supermercados', 'Lanchonetes', 'Móveis Para Escritório'].map((cat) => (
                <Link 
                  key={cat} 
                  to={`/catalogo?cat=${cat}`}
                  className="text-white/50 hover:text-accent transition-colors font-bold text-sm uppercase tracking-widest flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {cat}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-neutral-bg rounded-2xl flex items-center justify-center text-accent shrink-0">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Garantia Estendida</h3>
                <p className="text-primary/60">Todos os nossos equipamentos possuem garantia de fábrica e suporte especializado.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-neutral-bg rounded-2xl flex items-center justify-center text-accent shrink-0">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Entrega Rápida</h3>
                <p className="text-primary/60">Logística própria para garantir que seu equipamento chegue impecável e no prazo.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-neutral-bg rounded-2xl flex items-center justify-center text-accent shrink-0">
                <Tool size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Montagem Grátis</h3>
                <p className="text-primary/60">Equipe técnica qualificada para realizar a instalação completa em seu estabelecimento.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-neutral-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">Destaques</span>
              <h2 className="text-4xl font-black tracking-tighter">LINHAS EM EVIDÊNCIA</h2>
            </div>
            <Link to="/catalogo" className="text-primary font-bold flex items-center gap-2 hover:text-accent transition-colors group">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[450px] rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full overflow-hidden">
                  <img 
                    src="https://instagram.fpcs1-1.fna.fbcdn.net/v/t51.82787-15/620411273_18146125075456641_4993748442091467742_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzgxNDMwOTY2NjUwODMzNjU3OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEyMDB4MTYwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=675IQzFTHbsQ7kNvwFhu6l9&_nc_oc=Adl-wzX8K8w18AfmjAhw8rYAy_wc9dz_eYzBJ011UOOKa8xaW1uULZ6n5dnPzHCwi3f0U2ep2Q0G42D0BfJY8ksL&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fpcs1-1.fna&_nc_gid=iUlULu96D3mN5gx8kZntcg&_nc_ss=8&oh=00_AfuXXnC6ek3SeufqkW8nVLxL0_03Ssc9e_QW2TIEaszRlA&oe=69A8C392" 
                    alt="Prateleiras" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-1/2 h-full overflow-hidden">
                  <img 
                    src="https://instagram.fpcs1-1.fna.fbcdn.net/v/t51.82787-15/619239102_18146114566456641_4781227247150010144_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=MzgxNDIzNzA1NjQ0NTUzMTg2Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEyMDB4MTYwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=A8d1Ln1vcBgQ7kNvwGzPw7j&_nc_oc=AdmJf0duO_l_ze5x1vI5g7HCLHGm7wEGEOs8NQWO12XLWJfJHMn4xTK430zjiq83jXbakPHfN9ZaZqsFwj_I2MJY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fpcs1-1.fna&_nc_gid=iUlULu96D3mN5gx8kZntcg&_nc_ss=8&oh=00_Afs4e_tZwMgIiJxjTCzfmYwPjGUrVpeMZCmyvj0jkQDZAA&oe=69A8C470" 
                    alt="Freezers" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-10 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">ASSISTÊNCIA TÉCNICA</h3>
                <p className="text-white/80 mb-6 max-w-sm leading-relaxed">Suporte especializado para seus equipamentos Lidermaq, garantindo vida longa ao seu investimento.</p>
                <Link to="/assistencia" className="btn-primary w-fit">Acessar Suporte</Link>
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
