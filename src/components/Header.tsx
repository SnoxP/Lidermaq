import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Search, User, LogOut, LayoutDashboard, Sun, Moon, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Assistência', path: '/assistencia' },
    { name: 'Contato', path: '/contato' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass-effect shadow-xl shadow-black/5 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform duration-500">
            <span className="font-black text-xl font-display">L</span>
          </div>
          <span className="text-2xl font-black tracking-tighter dark:text-white font-display">
            LIDERMAQ
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-accent relative group ${
                location.pathname === link.path ? 'text-accent' : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-zinc-100 dark:bg-white/5 rounded-full border border-zinc-200 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Phone size={14} className="text-accent" />
              <span className="text-xs font-bold tracking-tight">(89) 99917-0800</span>
            </div>
            
            <div className="w-px h-4 bg-zinc-300 dark:bg-white/10" />
            
            <button 
              onClick={toggleTheme}
              className="text-zinc-500 dark:text-zinc-400 hover:text-accent transition-colors"
              title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-zinc-500 dark:text-zinc-400 hover:text-accent transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            
            {/* User Auth Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-accent/50 transition-all"
              >
                <User size={20} />
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-64 glass-effect rounded-[1.5rem] shadow-2xl border border-zinc-200 dark:border-white/10 p-2 z-[60] overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-white/5 mb-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Conta Lidermaq</p>
                      <p className="text-sm font-bold truncate dark:text-white">{user?.email || 'Visitante'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      {user ? (
                        <>
                          {user.isAdmin && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                            >
                              <LayoutDashboard size={18} className="text-accent" /> Painel Admin
                            </Link>
                          )}

                          <Link 
                            to="/perfil" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <User size={18} className="text-accent" /> Meu Perfil
                          </Link>
                          
                          <button 
                            onClick={() => { logout(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <LogOut size={18} /> Sair
                          </button>
                        </>
                      ) : (
                        <Link 
                          to="/login" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold bg-accent text-white rounded-xl hover:brightness-110 transition-all"
                        >
                          <LogIn size={18} /> Entrar na Conta
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              className="lg:hidden p-2.5 bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white rounded-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 lg:hidden bg-white dark:bg-neutral-900 z-[100] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-neutral-bg dark:border-white/10">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 overflow-hidden">
                  <img 
                    src="https://i.imgur.com/muVpHcv.png" 
                    alt="Lidermaq Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold tracking-tighter text-primary dark:text-white">LIDERMAQ</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-neutral-bg dark:bg-white/5 dark:text-white rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
              <p className="text-[10px] font-black text-primary/30 dark:text-white/30 uppercase tracking-[0.2em] mb-4">Navegação</p>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-black tracking-tighter py-3 flex items-center justify-between group ${
                    location.pathname === link.path ? 'text-accent' : 'text-primary dark:text-white'
                  }`}
                >
                  {link.name.toUpperCase()}
                  <div className={`w-2 h-2 rounded-full bg-accent transition-transform ${location.pathname === link.path ? 'scale-100' : 'scale-0'}`} />
                </Link>
              ))}
              
              <div className="mt-12 pt-12 border-t border-neutral-bg dark:border-white/10">
                <p className="text-[10px] font-black text-primary/30 dark:text-white/30 uppercase tracking-[0.2em] mb-6">Atendimento</p>
                <a 
                  href="https://wa.me/5589999170800" 
                  className="flex items-center justify-between p-6 bg-accent text-white rounded-3xl font-black tracking-tighter text-xl"
                >
                  FALAR NO WHATSAPP
                  <Phone size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
