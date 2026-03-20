import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, Users, Settings, TrendingUp, Package, FileText, Database, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { SeedData } from '../components/admin/SeedData';
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { SEO } from '../components/SEO';

import { formatCurrency } from '../utils/format';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const [userCount, setUserCount] = useState<number | string>('...');
  const [viewCount, setViewCount] = useState<number | string>('...');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      if (!db) return;
      try {
        // Fetch User Count
        const usersSnap = await getDocs(collection(db, 'users'));
        setUserCount(usersSnap.size);

        // Fetch View Count (from a dedicated stats document)
        const statsRef = doc(db, 'settings', 'stats');
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          setViewCount(statsSnap.data().totalViews || 0);
        } else {
          // Initialize stats if not exists
          await setDoc(statsRef, { totalViews: 0 });
          setViewCount(0);
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { label: 'Total de Produtos', value: loading ? '...' : products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', path: '/admin/produtos' },
    { label: 'Categorias', value: 6, icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-100', path: '/admin/categorias' },
    { label: 'Visualizações', value: viewCount, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Usuários', value: userCount, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100', path: '/admin/usuarios-registrados' },
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO title="Painel Administrativo - Lidermaq" />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Painel Administrativo</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-12">
          <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">Painel Administrativo</span>
          <h1 className="text-4xl font-black tracking-tighter dark:text-white font-display">OLÁ, {user?.name?.toUpperCase()}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Gerencie seus produtos e visualize o desempenho do site.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => stat.path && navigate(stat.path)}
              className={`bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-6 ${stat.path ? 'cursor-pointer hover:border-accent/50 transition-colors' : ''}`}
            >
              <div className={`w-14 h-14 ${stat.bg} dark:bg-zinc-800 ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-white font-display">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <SeedData />
          
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white font-display">
              <PackagePlus className="text-accent" /> Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/admin/produtos')}
                className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <p className="font-bold mb-1 text-zinc-900 dark:text-white group-hover:text-accent">Listar Produtos</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Ver e editar todos os itens</p>
              </button>
              <button 
                onClick={() => navigate('/admin/novo-produto')}
                className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <p className="font-bold mb-1 text-zinc-900 dark:text-white group-hover:text-accent">Novo Produto</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Adicionar item ao catálogo</p>
              </button>
              <button 
                onClick={() => navigate('/admin/categorias')}
                className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <p className="font-bold mb-1 text-zinc-900 dark:text-white group-hover:text-accent">Categorias</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Gerenciar categorias</p>
              </button>
              <button 
                onClick={() => navigate('/admin/usuarios-registrados')}
                className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <p className="font-bold mb-1 text-zinc-900 dark:text-white group-hover:text-accent">Usuários</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Ver clientes cadastrados</p>
              </button>
              <button 
                onClick={() => navigate('/admin/cupons')}
                className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <p className="font-bold mb-1 text-zinc-900 dark:text-white group-hover:text-accent">Cupons</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Gerenciar descontos</p>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white font-display">
              <Database className="text-accent" /> Produtos Recentes
            </h3>
            <Link to="/admin/produtos" className="text-sm font-bold text-accent hover:underline">Ver todos</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <th className="pb-4 font-bold">Produto</th>
                  <th className="pb-4 font-bold">Categoria</th>
                  <th className="pb-4 font-bold">Preço</th>
                  <th className="pb-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500 dark:text-zinc-400">Carregando produtos...</td>
                  </tr>
                ) : products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 font-medium text-zinc-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="truncate max-w-[200px]">{product.name}</span>
                    </td>
                    <td className="py-4 text-zinc-600 dark:text-zinc-400">{product.category}</td>
                    <td className="py-4 font-bold text-zinc-900 dark:text-white">{formatCurrency(product.price)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.inStock 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {product.inStock ? 'Em Estoque' : 'Esgotado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
