import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Shield, Truck, PenTool as Tool } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { usePosts } from '../hooks/usePosts';

export const Home = () => {
  const { products, loading: productsLoading } = useProducts();
  const { posts, loading: postsLoading } = usePosts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="pt-20">
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
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
              MÁQUINAS E EQUIPAMENTOS DE<br />
              <span className="text-accent text-3xl md:text-5xl">PADARIAS, RESTAURANTES, AÇOUGUES, SUPERMERCADOS, LANCHONETES E MÓVEIS PARA ESCRITÓRIO.</span>
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Equipamentos de alta performance, durabilidade e a garantia de quem entende do seu negócio há mais de 30 anos. Potencialize sua empresa com a Lidermaq.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalogo" className="btn-primary text-lg px-10">
                Ver Catálogo <ArrowRight size={20} />
              </Link>
              <a href="https://wa.me/558999999999" className="btn-secondary border-white text-white hover:bg-white hover:text-primary text-lg px-10">
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

      {/* Institutional Blocks */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[400px] rounded-3xl overflow-hidden group">
              <img src="https://picsum.photos/seed/assist/800/600" alt="Assistência" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/50 p-10 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white mb-4">ASSISTÊNCIA TÉCNICA</h3>
                <p className="text-white/70 mb-6 max-w-sm">Suporte especializado para seus equipamentos Lidermaq, garantindo vida longa ao seu investimento.</p>
                <Link to="/assistencia" className="btn-primary w-fit">Acessar Suporte</Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden group">
              <img src="https://picsum.photos/seed/parts/800/600" alt="Componentes" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/50 p-10 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white mb-4">COMPONENTES DE REPOSIÇÃO</h3>
                <p className="text-white/70 mb-6 max-w-sm">Precisa de uma peça específica? Temos um catálogo completo de componentes originais.</p>
                <Link to="/componentes" className="btn-primary w-fit">Ver Peças</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-neutral-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4">BLOG LIDERMAQ</h2>
            <p className="text-primary/60 max-w-2xl mx-auto">Dicas técnicas, manutenção preventiva e as últimas novidades do mercado de equipamentos industriais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {postsLoading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-white rounded-3xl animate-pulse shadow-sm" />
              ))
            ) : (
              posts.slice(0, 2).map((post) => (
                <div key={post.id} className="bg-white rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-shadow">
                  <div className="sm:w-1/3 h-48 sm:h-auto">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-center">
                    <span className="text-accent text-xs font-bold uppercase mb-2">{post.category}</span>
                    <h3 className="text-xl font-bold mb-4">{post.title}</h3>
                    <p className="text-sm text-primary/60 mb-6">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="text-primary font-bold text-sm flex items-center gap-2 hover:text-accent transition-colors">
                      Leia mais <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))
            )}
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
