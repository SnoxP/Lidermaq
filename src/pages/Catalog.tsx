import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../hooks/useProducts';
import { SEO } from '../components/SEO';

export const Catalog = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const activeCategory = searchParams.get('cat') || 'Todos';

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeCategory, searchTerm, sortBy]);

  return (
    <div className="pt-32 pb-20">
      <SEO 
        title={`Catálogo de Equipamentos ${activeCategory !== 'Todos' ? `- ${activeCategory}` : ''}`}
        description={`Confira nossa linha completa de equipamentos para ${activeCategory !== 'Todos' ? activeCategory : 'padarias, restaurantes e muito mais'}. Qualidade Lidermaq.`}
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">CATÁLOGO COMPLETO</h1>
          <p className="text-primary/60 max-w-2xl">Explore nossa linha completa de equipamentos para padarias, restaurantes, açougues, supermercados, lanchonetes e móveis para escritório.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Categories Sidebar/Bar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-neutral-bg p-6 rounded-2xl">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Filter size={18} /> Categorias
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSearchParams({ cat })}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all text-left ${
                      activeCategory === cat 
                        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                        : 'bg-white text-primary/60 hover:bg-white/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar equipamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
              <div className="relative min-w-[200px]">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none font-semibold cursor-pointer"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40" size={20} />
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-80 bg-neutral-bg rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-xl text-primary/40 font-bold">Nenhum produto encontrado para sua busca.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSearchParams({});}}
                  className="mt-4 text-accent font-bold underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
