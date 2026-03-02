import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, Users, Settings, TrendingUp, Package, FileText, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { SeedData } from '../components/admin/SeedData';
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc, setDoc, increment } from 'firebase/firestore';

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
    <div className="pt-32 pb-20 bg-neutral-bg dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">Painel Administrativo</span>
          <h1 className="text-4xl font-black tracking-tighter dark:text-white">OLÁ, {user?.name?.toUpperCase()}</h1>
          <p className="text-primary/60 dark:text-zinc-400">Gerencie seus produtos e visualize o desempenho do site.</p>
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
              className={`bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm flex items-center gap-6 ${stat.path ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            >
              <div className={`w-14 h-14 ${stat.bg} dark:bg-accent/10 ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-primary/40 dark:text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-primary dark:text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <SeedData />
          
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
              <PackagePlus className="text-accent" /> Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/admin/produtos')}
                className="p-4 bg-neutral-bg dark:bg-zinc-800 rounded-2xl text-left hover:bg-accent hover:text-white transition-all group"
              >
                <p className="font-bold mb-1 dark:text-white group-hover:text-white">Listar Produtos</p>
                <p className="text-xs opacity-60 dark:text-zinc-400 group-hover:text-white/80">Ver e editar todos os itens</p>
              </button>
              <button 
                onClick={() => navigate('/admin/usuarios-registrados')}
                className="p-4 bg-neutral-bg dark:bg-zinc-800 rounded-2xl text-left hover:bg-accent hover:text-white transition-all group"
              >
                <p className="font-bold mb-1 dark:text-white group-hover:text-white">Usuários Registrados</p>
                <p className="text-xs opacity-60 dark:text-zinc-400 group-hover:text-white/80">Ver quem está logado no site</p>
              </button>
              <button 
                onClick={() => navigate('/admin/usuarios')}
                className="p-4 bg-neutral-bg dark:bg-zinc-800 rounded-2xl text-left hover:bg-accent hover:text-white transition-all group"
              >
                <p className="font-bold mb-1 dark:text-white group-hover:text-white">Gerenciar Admins</p>
                <p className="text-xs opacity-60 dark:text-zinc-400 group-hover:text-white/80">Adicione novos administradores</p>
              </button>
              <button 
                onClick={() => navigate('/admin/novo-produto')}
                className="p-4 bg-neutral-bg dark:bg-zinc-800 rounded-2xl text-left hover:bg-accent hover:text-white transition-all group"
              >
                <p className="font-bold mb-1 dark:text-white group-hover:text-white">Novo Produto</p>
                <p className="text-xs opacity-60 dark:text-zinc-400 group-hover:text-white/80">Adicione um item ao catálogo</p>
              </button>
              <button 
                onClick={() => navigate('/admin/categorias')}
                className="p-4 bg-neutral-bg dark:bg-zinc-800 rounded-2xl text-left hover:bg-accent hover:text-white transition-all group"
              >
                <p className="font-bold mb-1 dark:text-white group-hover:text-white">Editar Categorias</p>
                <p className="text-xs opacity-60 dark:text-zinc-400 group-hover:text-white/80">Gerencie os setores do site</p>
              </button>
              <button 
                onClick={() => navigate('/admin/configuracoes')}
                className="p-4 bg-neutral-bg dark:bg-zinc-800 rounded-2xl text-left hover:bg-accent hover:text-white transition-all group"
              >
                <p className="font-bold mb-1 dark:text-white group-hover:text-white">Configurações</p>
                <p className="text-xs opacity-60 dark:text-zinc-400 group-hover:text-white/80">Ajustes gerais do sistema</p>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Últimos Produtos Adicionados</h3>
            <div className="space-y-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-neutral-bg dark:bg-zinc-800 rounded-2xl animate-pulse" />
                ))
              ) : products.length === 0 ? (
                <p className="text-primary/40 dark:text-zinc-500 italic text-center py-8">Nenhum produto cadastrado.</p>
              ) : (
                products.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-neutral-bg dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-bg dark:bg-zinc-700">
                      <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate dark:text-white">{product.name}</p>
                      <p className="text-xs text-primary/40 dark:text-zinc-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm dark:text-white">R$ {product.price.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
