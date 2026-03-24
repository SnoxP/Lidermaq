import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Filter, Search, ChevronDown, Plus, Square, LayoutGrid, Grid3X3, Grid2X2, X, Tag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [columnsCount, setColumnsCount] = useState(1);
  const [mobileGridCols, setMobileGridCols] = useState<1 | 2 | 3 | 4>(() => {
    const saved = localStorage.getItem('mobileGridCols');
    return saved ? (parseInt(saved, 10) as 1 | 2 | 3 | 4) : 1;
  });

  const [categoriesExpanded, setCategoriesExpanded] = useState(() => {
    const saved = localStorage.getItem('lidermaq_categoriesExpanded');
    return saved ? JSON.parse(saved) : true;
  });
  const [brandsExpanded, setBrandsExpanded] = useState(() => {
    const saved = localStorage.getItem('lidermaq_brandsExpanded');
    return saved ? JSON.parse(saved) : true;
  });
  const [availabilityExpanded, setAvailabilityExpanded] = useState(() => {
    const saved = localStorage.getItem('lidermaq_availabilityExpanded');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('lidermaq_categoriesExpanded', JSON.stringify(categoriesExpanded));
  }, [categoriesExpanded]);

  useEffect(() => {
    localStorage.setItem('lidermaq_brandsExpanded', JSON.stringify(brandsExpanded));
  }, [brandsExpanded]);

  useEffect(() => {
    localStorage.setItem('lidermaq_availabilityExpanded', JSON.stringify(availabilityExpanded));
  }, [availabilityExpanded]);

  const activeCategory = searchParams.get('cat') || 'Todos';
  const searchQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

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

    if (searchTerm || searchQuery) {
      const term = (searchTerm || searchQuery).toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    if (inStockOnly) {
      result = result.filter(p => p.available);
    }

    return result;
  }, [activeCategory, searchTerm, searchQuery, products, selectedBrands, inStockOnly]);

  const itemsPerPage = columnsCount * 7;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    updateParams({ page: '1' });
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO 
        title={`Catálogo de Equipamentos ${activeCategory !== 'Todos' ? `- ${activeCategory}` : ''}`}
        description={`Confira nossa linha completa de equipamentos para ${activeCategory !== 'Todos' ? activeCategory : 'padarias, restaurantes e muito mais'}. Qualidade Lidermaq.`}
      />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Catálogo</span>
          {activeCategory !== 'Todos' && (
            <>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-zinc-900 dark:text-white font-medium">{activeCategory}</span>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 sticky top-32">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wider">Filtros</h2>
              
              {/* Categories */}
              <div className="mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <button 
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="w-full flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider group"
                >
                  Categorias
                  <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${categoriesExpanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {categoriesExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-4">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              updateParams({ cat: category === 'Todos' ? null : category, page: '1' });
                            }}
                            className={`block w-full text-left text-sm py-1 transition-colors ${
                              activeCategory === category 
                                ? 'text-accent font-bold' 
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-accent dark:hover:text-accent'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                  <button 
                    onClick={() => setBrandsExpanded(!brandsExpanded)}
                    className="w-full flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider group"
                  >
                    Marcas
                    <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${brandsExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {brandsExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar pt-4">
                          {brands.map(brand => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                              />
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                selectedBrands.includes(brand) 
                                  ? 'bg-accent border-accent text-white' 
                                  : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 group-hover:border-accent'
                              }`}>
                                {selectedBrands.includes(brand) && <Square className="w-3 h-3 fill-current" />}
                              </div>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                {brand}
                              </span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Availability */}
              <div>
                <button 
                  onClick={() => setAvailabilityExpanded(!availabilityExpanded)}
                  className="w-full flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider group"
                >
                  Disponibilidade
                  <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${availabilityExpanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {availabilityExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={inStockOnly}
                            onChange={(e) => {
                              setInStockOnly(e.target.checked);
                              updateParams({ page: '1' });
                            }}
                          />
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            inStockOnly 
                              ? 'bg-accent border-accent text-white' 
                              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 group-hover:border-accent'
                          }`}>
                            {inStockOnly && <Square className="w-3 h-3 fill-current" />}
                          </div>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                            Apenas em estoque
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg font-medium text-sm w-full sm:w-auto justify-center"
                >
                  <Filter size={16} /> Filtros
                </button>
                <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{filteredProducts.length} produtos encontrados</span>
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(activeCategory !== 'Todos' || selectedBrands.length > 0 || inStockOnly || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-full border border-zinc-200 dark:border-zinc-700">
                    Busca: {searchQuery}
                    <button onClick={() => updateParams({ q: null, page: '1' })} className="hover:text-accent"><X size={12} /></button>
                  </span>
                )}
                {activeCategory !== 'Todos' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-full border border-zinc-200 dark:border-zinc-700">
                    {activeCategory}
                    <button onClick={() => updateParams({ cat: null, page: '1' })} className="hover:text-accent"><X size={12} /></button>
                  </span>
                )}
                {selectedBrands.map(brand => (
                  <span key={brand} className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-full border border-zinc-200 dark:border-zinc-700">
                    {brand}
                    <button onClick={() => toggleBrand(brand)} className="hover:text-accent"><X size={12} /></button>
                  </span>
                ))}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-full border border-zinc-200 dark:border-zinc-700">
                    Em estoque
                    <button onClick={() => setInStockOnly(false)} className="hover:text-accent"><X size={12} /></button>
                  </span>
                )}
                <button 
                  onClick={() => {
                    updateParams({ cat: null, q: null, page: '1' });
                    setSelectedBrands([]);
                    setInStockOnly(false);
                  }}
                  className="text-xs text-accent hover:underline ml-2"
                >
                  Limpar todos
                </button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
                <Search size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Nenhum produto encontrado</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">Tente ajustar seus filtros ou buscar por outro termo.</p>
                <button 
                  onClick={() => {
                    updateParams({ cat: null, q: null, page: '1' });
                    setSelectedBrands([]);
                    setInStockOnly(false);
                  }}
                  className="px-6 py-3 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 sm:gap-6 ${
                  columnsCount === 3 ? 'grid-cols-3' : 
                  columnsCount === 2 ? 'grid-cols-2' : 
                  `grid-cols-${mobileGridCols}`
                }`}>
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="product-card-item"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateParams({ page: (i + 1).toString() })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                          currentPage === i + 1
                            ? 'bg-accent text-white shadow-lg shadow-accent/20'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl z-[130] overflow-y-auto flex flex-col lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-white/5 sticky top-0 bg-white dark:bg-zinc-950 z-10">
                <span className="text-xl font-black font-display dark:text-white">FILTROS</span>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-10 h-10 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center text-zinc-500 hover:bg-accent hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex-1">
                {/* Mobile Grid Controls */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Visualização</h3>
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl">
                    <button onClick={() => handleGridChange(1)} className={`flex-1 flex justify-center p-2 rounded-lg transition-all ${mobileGridCols === 1 ? 'bg-white dark:bg-zinc-700 shadow-sm text-accent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}><Square size={20} /></button>
                    <button onClick={() => handleGridChange(2)} className={`flex-1 flex justify-center p-2 rounded-lg transition-all ${mobileGridCols === 2 ? 'bg-white dark:bg-zinc-700 shadow-sm text-accent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}><LayoutGrid size={20} /></button>
                    <button onClick={() => handleGridChange(3)} className={`flex-1 flex justify-center p-2 rounded-lg transition-all ${mobileGridCols === 3 ? 'bg-white dark:bg-zinc-700 shadow-sm text-accent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}><Grid3X3 size={20} /></button>
                    <button onClick={() => handleGridChange(4)} className={`flex-1 flex justify-center p-2 rounded-lg transition-all ${mobileGridCols === 4 ? 'bg-white dark:bg-zinc-700 shadow-sm text-accent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}><Grid2X2 size={20} /></button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Categorias</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          updateParams({ cat: category === 'Todos' ? null : category, page: '1' });
                          setShowMobileFilters(false);
                        }}
                        className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                          activeCategory === category 
                            ? 'bg-accent/10 text-accent font-bold' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Marcas</h3>
                    <div className="space-y-3">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            selectedBrands.includes(brand) 
                              ? 'bg-accent border-accent text-white' 
                              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                          }`}>
                            {selectedBrands.includes(brand) && <Square className="w-3 h-3 fill-current" />}
                          </div>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Disponibilidade</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      inStockOnly 
                        ? 'bg-accent border-accent text-white' 
                        : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                    }`}>
                      {inStockOnly && <Square className="w-3 h-3 fill-current" />}
                    </div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Apenas em estoque
                    </span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-100 dark:border-white/5 sticky bottom-0 bg-white dark:bg-zinc-950">
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors"
                >
                  Ver {filteredProducts.length} produtos
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
