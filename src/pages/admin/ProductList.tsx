import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Edit2, Trash2, Plus, ExternalLink, X, Database, Filter, ArrowUpDown, Calendar, Tag, DollarSign } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [brandFilter, setBrandFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const fetchProducts = async () => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn("Busca de produtos excedeu o tempo limite.");
      }
    }, 10000); // 10 segundos de timeout

    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = brandFilter === '' || p.brand === brandFilter;
      
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'price') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: 'name' | 'price' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">TODOS OS PRODUTOS</h1>
              <p className="text-primary/60">Gerencie o catálogo completo da Lidermaq.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-4 rounded-xl border transition-all flex items-center gap-2 font-bold ${showFilters ? 'bg-accent text-white border-accent' : 'bg-white text-primary border-neutral-bg hover:bg-neutral-bg'}`}
              >
                <Filter size={20} /> Filtros
              </button>
              <button 
                onClick={() => navigate('/admin/novo-produto')}
                className="btn-primary px-6 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} /> Novo
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
              <input 
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 shadow-sm"
                placeholder="Buscar por nome, marca ou categoria..."
              />
            </div>
          </div>

          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl shadow-sm border border-neutral-bg"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-1">
                  <Tag size={12} /> Marca
                </label>
                <select 
                  value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm"
                >
                  <option value="">Todas as Marcas</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-1">
                  <ArrowUpDown size={12} /> Ordenar por
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleSort('name')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-all ${sortBy === 'name' ? 'bg-accent/10 border-accent text-accent' : 'bg-neutral-bg border-transparent text-primary/60'}`}
                  >
                    Nome
                  </button>
                  <button 
                    onClick={() => toggleSort('price')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-all ${sortBy === 'price' ? 'bg-accent/10 border-accent text-accent' : 'bg-neutral-bg border-transparent text-primary/60'}`}
                  >
                    Preço
                  </button>
                  <button 
                    onClick={() => toggleSort('createdAt')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-all ${sortBy === 'createdAt' ? 'bg-accent/10 border-accent text-accent' : 'bg-neutral-bg border-transparent text-primary/60'}`}
                  >
                    Data
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-1">
                  <ArrowUpDown size={12} /> Ordem
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSortOrder('asc')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-all ${sortOrder === 'asc' ? 'bg-accent/10 border-accent text-accent' : 'bg-neutral-bg border-transparent text-primary/60'}`}
                  >
                    Crescente
                  </button>
                  <button 
                    onClick={() => setSortOrder('desc')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-all ${sortOrder === 'desc' ? 'bg-accent/10 border-accent text-accent' : 'bg-neutral-bg border-transparent text-primary/60'}`}
                  >
                    Decrescente
                  </button>
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setBrandFilter('');
                    setSortBy('createdAt');
                    setSortOrder('desc');
                  }}
                  className="w-full py-3 px-4 bg-neutral-bg text-primary/60 font-bold rounded-xl text-xs hover:bg-neutral-bg/80 transition-all flex items-center justify-center gap-2"
                >
                  <X size={14} /> Limpar Filtros
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-bg/50 text-xs font-bold uppercase tracking-widest text-primary/40">
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Marca</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-bg">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-primary/40 animate-pulse">Carregando produtos...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-primary/40 italic mb-4">Nenhum produto encontrado no banco de dados.</p>
                      <button 
                        onClick={() => navigate('/admin')}
                        className="text-accent font-bold hover:underline flex items-center gap-2 mx-auto"
                      >
                        <Database size={16} /> Importar catálogo inicial no Painel
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-bg/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-neutral-bg rounded-lg overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary/20"><Package size={20} /></div>
                            )}
                          </div>
                          <span className="font-bold text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-sm">{product.brand}</td>
                      <td className="px-6 py-4 text-sm font-bold text-accent">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/editar-produto/${product.id}`)}
                            className="p-3 text-primary hover:bg-neutral-bg rounded-xl transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
