import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Search, ChevronDown, Plus, Square, LayoutGrid, Grid3X3, Grid2X2, X, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';
import { Header } from '../components/Header';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const Catalog = () => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [columnsCount, setColumnsCount] = useState(1);
  const [mobileGridCols, setMobileGridCols] = useState<1 | 2 | 3 | 4>(() => {
    const saved = localStorage.getItem('mobileGridCols');
    return saved ? (parseInt(saved, 10) as 1 | 2 | 3 | 4) : 1;
  });

  const activeCategory = searchParams.get('cat') || 'Todos';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1280) {
        setColumnsCount(3);
      } else if (window.innerWidth >= 640) {
        setColumnsCount(2);
      } else {
        setColumnsCount(mobileGridCols);
      }
    };
    
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [mobileGridCols]);

  const handleGridChange = (cols: 1 | 2 | 3 | 4) => {
    // Find the first visible product card to maintain scroll position
    const productCards = document.querySelectorAll('.product-card-item');
    let firstVisibleCard: Element | null = null;
    let offset = 0;

    for (const card of productCards) {
      const rect = card.getBoundingClientRect();
      if (rect.top >= 0 || rect.bottom > 0) {
        firstVisibleCard = card;
        offset = rect.top;
        break;
      }
    }

    setMobileGridCols(cols);
    localStorage.setItem('mobileGridCols', cols.toString());

    if (firstVisibleCard) {
      // Use requestAnimationFrame to wait for the DOM to update with new grid layout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const newRect = firstVisibleCard!.getBoundingClientRect();
          window.scrollBy(0, newRect.top - offset);
        });
      });
    }
  };

  const brands = useMemo(() => {
    let filteredForBrands = products;
    if (activeCategory !== 'Todos') {
      filteredForBrands = products.filter(p => p.category === activeCategory);
    }
    const uniqueBrands = Array.from(new Set(filteredForBrands.map(p => {
      // Remove accents and convert to uppercase
      return p.brand.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    })));
    return uniqueBrands.sort();
  }, [products, activeCategory]);

  useEffect(() => {
    const validSelectedBrands = selectedBrands.filter(b => brands.includes(b));
    if (validSelectedBrands.length !== selectedBrands.length) {
      setSelectedBrands(validSelectedBrands);
      updateParams({ page: '1' });
    }
  }, [brands, selectedBrands]);

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
  }, [currentPage]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        const pBrandFormatted = p.brand.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        return selectedBrands.includes(pBrandFormatted);
      });
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (inStockOnly) {
      result = result.filter(p => p.available);
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeCategory, searchTerm, sortBy, products, selectedBrands]);

  const itemsPerPage = columnsCount * 7;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 relative overflow-hidden">
      {/* Background Image Header */}
      <div className="absolute top-0 left-0 w-full h-[500px] z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/80 to-zinc-50 dark:via-zinc-950/80 dark:to-zinc-950 z-10" />
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://i.imgur.com/X9p9yuC.png" 
          alt="Lidermaq Empresa Mobile" 
          className="w-full h-full object-cover object-[30%_center] md:hidden"
          referrerPolicy="no-referrer"
        />
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://i.imgur.com/X9p9yuC.png" 
          alt="Lidermaq Empresa Desktop" 
          className="w-full h-full object-cover hidden md:block"
          referrerPolicy="no-referrer"
        />
      </div>

      <SEO 
        title={`Catálogo de Equipamentos ${activeCategory !== 'Todos' ? `- ${activeCategory}` : ''}`}
        description={`Confira nossa linha completa de equipamentos para ${activeCategory !== 'Todos' ? activeCategory : 'padarias, restaurantes e muito mais'}. Qualidade Lidermaq.`}
      />
      <div className="relative z-20 container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 dark:text-white font-display">CATÁLOGO COMPLETO</h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">Explore nossa linha completa de equipamentos para padarias, restaurantes, açougues, supermercados, lanchonetes e móveis para escritório.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Categories Sidebar/Bar */}
          <div 
            className={`lg:w-64 shrink-0 grid transition-all duration-500 ease-in-out ${
              showMobileFilters ? 'grid-rows-[1fr] opacity-100 mb-8 lg:mb-0' : 'grid-rows-[0fr] opacity-0 lg:grid-rows-[1fr] lg:opacity-100'
            }`}
          >
            <div className="overflow-hidden">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-white/5 transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2 dark:text-white font-display">
                    <Filter size={18} className="text-accent" /> Filtros
                  </h3>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="lg:hidden p-2 -mr-2 -mt-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Setores</h4>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateParams({ cat: cat === 'Todos' ? null : cat, page: '1' });
                      }}
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Buscar equipamentos..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        updateParams({ page: '1' });
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-sm"
                    />
                  </div>
                  
                  {brands.length > 0 && activeCategory === 'Todos' && (
                    <div className="relative hidden lg:block w-1/5">
                      <button
                        onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                        className="w-full h-full flex justify-between items-center px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl font-bold text-accent shadow-sm"
                      >
                        <span className="truncate">{selectedBrands.length > 0 ? `${selectedBrands.length} marca(s)` : 'Marcas'}</span>
                        <ChevronDown size={20} className={`transition-transform shrink-0 ${showBrandDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showBrandDropdown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="absolute top-full left-0 w-[400px] mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2 z-40"
                        >
                          {brands.map(brand => (
                            <button
                              key={brand}
                              onClick={() => {
                                setSelectedBrands(prev => 
                                  prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                                );
                                updateParams({ page: '1' });
                              }}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all text-left ${
                                selectedBrands.includes(brand)
                                  ? 'bg-accent text-white'
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                              }`}
                            >
                              {brand}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Grid Toggle */}
              <div className="flex md:hidden items-center justify-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
                <button 
                  onClick={() => handleGridChange(1)}
                  className={`p-2 rounded-xl transition-all ${mobileGridCols === 1 ? 'bg-accent text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'}`}
                  title="1 por linha"
                >
                  <Square size={20} />
                </button>
                <button 
                  onClick={() => handleGridChange(2)}
                  className={`p-2 rounded-xl transition-all ${mobileGridCols === 2 ? 'bg-accent text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'}`}
                  title="2 por linha"
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  onClick={() => handleGridChange(3)}
                  className={`p-2 rounded-xl transition-all ${mobileGridCols === 3 ? 'bg-accent text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'}`}
                  title="3 por linha"
                >
                  <Grid3X3 size={20} />
                </button>
                <button 
                  onClick={() => handleGridChange(4)}
                  className={`p-2 rounded-xl transition-all ${mobileGridCols === 4 ? 'bg-accent text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'}`}
                  title="4 por linha"
                >
                  <Grid2X2 size={20} />
                </button>
              </div>
            </div>

            {activeCategory === 'Todos' ? (
              <div className="mb-8 flex gap-2 relative z-30 lg:hidden">
                {brands.length > 0 && (
                  <div className="flex-1 relative">
                    <button
                      onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                      className="w-full h-full flex justify-between items-center px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl font-bold text-accent shadow-sm"
                    >
                      <span className="truncate">{selectedBrands.length > 0 ? `${selectedBrands.length} marca(s)` : 'Marcas'}</span>
                      <ChevronDown size={20} className={`transition-transform shrink-0 ${showBrandDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showBrandDropdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="absolute top-full left-0 w-[calc(100vw-2rem)] mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl shadow-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-2"
                      >
                        {brands.map(brand => (
                          <button
                            key={brand}
                            onClick={() => {
                              setSelectedBrands(prev => 
                                prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                              );
                              updateParams({ page: '1' });
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all text-left ${
                              selectedBrands.includes(brand)
                                ? 'bg-accent text-white'
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl text-accent shadow-sm flex flex-col items-center justify-center transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 shrink-0"
                >
                  <span className="font-bold text-sm leading-tight">Setores</span>
                </button>
              </div>
            ) : (
              <div className="mb-8 flex flex-col gap-4 lg:hidden">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl text-accent shadow-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm leading-tight">Setor Selecionado:</span>
                    <span className="text-lg font-black text-zinc-800 dark:text-white leading-tight">{activeCategory}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-zinc-400">Trocar setor</span>
                  </div>
                </button>

                {brands.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {brands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => {
                            setSelectedBrands(prev => 
                              prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                            );
                            updateParams({ page: '1' });
                          }}
                          className={`px-2 py-2 rounded-xl text-xs md:text-sm font-bold transition-all truncate ${
                            selectedBrands.includes(brand)
                              ? 'bg-accent text-white'
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative block rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/5 bg-zinc-900 mb-4 max-w-3xl mx-auto"
            >
              <img 
                src="https://i.imgur.com/TNJcglg.png" 
                alt="Assistência Técnica Lidermaq" 
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Grid */}
            {loading ? (
              <div className={`grid gap-2 sm:gap-8 ${mobileGridCols === 1 ? 'grid-cols-1' : mobileGridCols === 2 ? 'grid-cols-2' : mobileGridCols === 3 ? 'grid-cols-3' : 'grid-cols-4'} sm:grid-cols-2 xl:grid-cols-3`}>
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-2 sm:gap-8 ${mobileGridCols === 1 ? 'grid-cols-1' : mobileGridCols === 2 ? 'grid-cols-2' : mobileGridCols === 3 ? 'grid-cols-3' : 'grid-cols-4'} sm:grid-cols-2 xl:grid-cols-3`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} gridCols={mobileGridCols} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => {
                            updateParams({ page: page.toString() });
                          }}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${
                            currentPage === page
                              ? 'bg-accent text-white shadow-lg shadow-accent/20'
                              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-white/5'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
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
