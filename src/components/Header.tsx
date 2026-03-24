import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, User, LogOut, LayoutDashboard, Sun, Moon, Monitor, LogIn, ShoppingBag, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cart, setIsCartOpen } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: 'Refrigeração Comercial', path: '/catalogo?q=refrigeracao' },
    { name: 'Maquinário de Produção', path: '/catalogo?q=maquina' },
    { name: 'Expositores de Alimentos', path: '/catalogo?q=expositor' },
    { name: 'Equipamentos para Cocção', path: '/catalogo?q=fogao' },
    { name: 'Portáteis Industriais', path: '/catalogo?q=liquidificador' },
    { name: 'Mobiliário Comercial', path: '/catalogo?q=mesa' }
  ];

  return (
    <>
      <header className="w-full z-[70] bg-white dark:bg-zinc-950 shadow-md sticky top-0">
        {/* Middle Bar */}
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg shadow-accent/20 overflow-hidden bg-white">
              <img src="https://i.imgur.com/vgZATEv.png" alt="Lidermaq Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black tracking-tighter font-display leading-none">
                <span className="text-accent">LIDER</span><span className="text-zinc-900 dark:text-white">MAQ</span>
              </span>
              <span className="text-[9px] md:text-[10px] font-medium font-sans text-zinc-900 dark:text-white tracking-[0.3em] leading-none mt-1">
                EQUIPAMENTOS
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="O que você está procurando?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-3 pl-6 pr-12 text-sm focus:outline-none focus:border-accent dark:focus:border-accent transition-colors dark:text-white"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-accent transition-colors">
              <Search size={20} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            {/* User Auth Menu */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-accent transition-colors">
                  <User size={20} />
                </div>
                <div className="hidden lg:block">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Bem-vindo</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-accent transition-colors">
                    {user ? 'Minha Conta' : 'Entre ou Cadastre-se'}
                  </p>
                </div>
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-white/10 p-2 z-[60] overflow-hidden"
                    >
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-white/5 mb-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Conta Lidermaq</p>
                      <p className="text-sm font-bold truncate dark:text-white">{user?.email || 'Visitante'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      {user ? (
                        <>
                          <Link 
                            to="/perfil" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <User size={16} /> Meu Perfil
                          </Link>
                          {user.isAdmin && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                            >
                              <LayoutDashboard size={16} /> Painel Administrativo
                            </Link>
                          )}
                          <button 
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <LogOut size={16} /> Sair da conta
                          </button>
                        </>
                      ) : (
                        <Link 
                          to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <LogIn size={16} /> Fazer Login
                        </Link>
                      )}
                    </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 text-left group"
            >
              <div className="relative w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center group-hover:bg-accent/90 transition-colors">
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 border-2 border-white dark:border-zinc-950 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Carrinho</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-accent transition-colors">
                  {cart.length} itens
                </p>
              </div>
            </button>

            {/* Hamburger Menu */}
            <button 
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-accent transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="O que você está procurando?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-3 pl-6 pr-12 text-sm focus:outline-none focus:border-accent dark:focus:border-accent transition-colors dark:text-white"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-accent transition-colors">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Bottom Bar - Categories */}
        <div className="bg-accent text-white hidden md:block">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-4 py-3">
              <div className="relative group">
                <button className="flex items-center gap-2 font-bold py-2 px-4 bg-black/10 hover:bg-black/20 rounded-lg transition-colors">
                  TODAS AS CATEGORIAS <ChevronDown size={16} />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col py-2 mt-3 rounded-xl">
                  {categories.map((cat, i) => (
                    <Link key={i} to={cat.path} className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-accent dark:hover:text-accent transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/catalogo" className="font-bold py-2 px-4 bg-black/10 hover:bg-black/20 rounded-lg transition-colors text-sm uppercase tracking-wider">Catálogo Completo</Link>
              <Link to="/catalogo?cat=Açougues" className="font-bold py-2 px-4 bg-black/10 hover:bg-black/20 rounded-lg transition-colors text-sm uppercase tracking-wider">Açougues</Link>
              <Link to="/catalogo?cat=Padarias" className="font-bold py-2 px-4 bg-black/10 hover:bg-black/20 rounded-lg transition-colors text-sm uppercase tracking-wider">Padarias</Link>
              <Link to="/catalogo?cat=Restaurantes" className="font-bold py-2 px-4 bg-black/10 hover:bg-black/20 rounded-lg transition-colors text-sm uppercase tracking-wider">Restaurantes</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl z-[130] overflow-y-auto flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-white/5">
                <span className="text-xl font-black font-display dark:text-white">MENU</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center text-zinc-500 hover:bg-accent hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-6">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 px-4">Categorias</p>
                  <div className="flex flex-col">
                    {categories.map((cat, i) => (
                      <Link 
                        key={i} 
                        to={cat.path} 
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 px-4">Navegação</p>
                  <div className="flex flex-col">
                    <Link to="/" onClick={() => setIsOpen(false)} className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors">Início</Link>
                    <Link to="/catalogo" onClick={() => setIsOpen(false)} className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors">Catálogo Completo</Link>
                    <Link to="/sobre" onClick={() => setIsOpen(false)} className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors">Sobre a Lidermaq</Link>
                    <Link to="/assistencia" onClick={() => setIsOpen(false)} className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors">Assistência Técnica</Link>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-6 border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex flex-col gap-4">
                  <a href="https://wa.me/5589999170800" className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <Phone size={18} className="text-accent" /> (89) 99917-0800
                  </a>
                  {user ? (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 font-medium">
                      <LayoutDashboard size={18} className="text-accent" /> Painel Admin
                    </Link>
                  ) : (
                    <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 font-medium">
                      <User size={18} className="text-accent" /> Entrar na Conta
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
