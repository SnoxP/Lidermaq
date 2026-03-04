import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Search, ChevronDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const Catalog = () => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrand, setSelectedBrand] = useState('TODAS');
  const [categories, setCategories] = useState<string[]>(['Todos']);

  const activeCategory = searchParams.get('cat') || 'Todos';

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => {
      // Remove accents and convert to uppercase
      return p.brand.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    })));
    return ['TODAS', ...uniqueBrands.sort()];
  }, [products]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const cats = querySnapshot.docs.map(doc => ({ name: doc.data().name, order: doc.data().order || 0 }));
        cats.sort((a, b) => a.order - b.order);
        setCategories(['Todos', ...cats.map(c => c.name)]);
      } catch (e) {
        console.error("Erro ao buscar categorias:", e);
      }
    };
    fetchCategories();
  }, []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (selectedBrand !== 'TODAS') {
      result = result.filter(p => {
        const pBrandFormatted = p.brand.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        return pBrandFormatted === selectedBrand;
      });
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
  }, [activeCategory, searchTerm, sortBy, products, selectedBrand]);

  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO 
        title={`Catálogo de Equipamentos ${activeCategory !== 'Todos' ? `- ${activeCategory}` : ''}`}
        description={`Confira nossa linha completa de equipamentos para ${activeCategory !== 'Todos' ? activeCategory : 'padarias, restaurantes e muito mais'}. Qualidade Lidermaq.`}
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 dark:text-white font-display">CATÁLOGO COMPLETO</h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">Explore nossa linha completa de equipamentos para padarias, restaurantes, açougues, supermercados, lanchonetes e móveis para escritório.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Categories Sidebar/Bar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-white/5 transition-colors duration-300">
              <h3 className="font-bold mb-6 flex items-center gap-2 dark:text-white font-display">
                <Filter size={18} className="text-accent" /> Categorias
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSearchParams({ cat })}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                      activeCategory === cat 
                        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                        : 'bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {user?.isAdmin && (
                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-white/5">
                  <button 
                    onClick={() => navigate('/admin/novo-produto')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent/10 text-accent rounded-xl font-bold text-sm hover:bg-accent hover:text-white transition-all"
                  >
                    <Plus size={18} /> Novo Produto
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar equipamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-sm"
                />
              </div>
              <div className="relative min-w-[200px]">
                <select 
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full appearance-none px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 dark:text-white rounded-2xl focus:outline-none font-bold cursor-pointer shadow-sm"
                >
                  {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" size={20} />
              </div>
              <div className="relative min-w-[200px]">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 dark:text-white rounded-2xl focus:outline-none font-bold cursor-pointer shadow-sm"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" size={20} />
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
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
                <p className="text-xl text-zinc-500 font-bold">Nenhum produto encontrado para sua busca.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSearchParams({});}}
                  className="mt-4 text-accent font-bold hover:underline"
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
