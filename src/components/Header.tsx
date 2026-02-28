import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-12 h-12 overflow-hidden">
            <img 
              src="https://i.imgur.com/muVpHcv.png" 
              alt="Lidermaq Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-primary' : 'text-primary'}`}>
            LIDERMAQ
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium uppercase tracking-wider hover:text-accent transition-colors ${
                location.pathname === link.path ? 'text-accent' : 'text-primary/70'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-neutral-bg rounded-full transition-colors hidden md:block">
            <Search size={20} />
          </button>
          
          {/* User Auth Menu */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center hover:bg-accent/20 transition-all"
                >
                  <User size={18} />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-neutral-bg p-2 z-[60]"
                    >
                      <div className="px-4 py-3 border-b border-neutral-bg mb-2">
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Usuário</p>
                        <p className="text-sm font-bold truncate">{user.email}</p>
                      </div>
                      
                      {user.isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-primary hover:bg-neutral-bg rounded-xl transition-colors"
                        >
                          <LayoutDashboard size={18} className="text-accent" /> Painel Admin
                        </Link>
                      )}

                      <Link 
                        to="/perfil" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-primary hover:bg-neutral-bg rounded-xl transition-colors"
                      >
                        <User size={18} className="text-accent" /> Meu Perfil
                      </Link>
                      
                      <button 
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={18} /> Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-4 sm:px-6 text-[10px] sm:text-xs">
                Login
              </Link>
            )}
          </div>

          <a href="tel:+5589999170800" className="hidden xl:flex items-center gap-2 text-sm font-semibold text-accent">
            <Phone size={18} />
            (89) 99917-0800
          </a>
          <button 
            className="lg:hidden p-2 bg-neutral-bg rounded-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
            className="fixed inset-0 lg:hidden bg-white z-[100] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-neutral-bg">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 overflow-hidden">
                  <img 
                    src="https://i.imgur.com/muVpHcv.png" 
                    alt="Lidermaq Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold tracking-tighter text-primary">LIDERMAQ</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-neutral-bg rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
              <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] mb-4">Navegação</p>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-black tracking-tighter py-3 flex items-center justify-between group ${
                    location.pathname === link.path ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {link.name.toUpperCase()}
                  <div className={`w-2 h-2 rounded-full bg-accent transition-transform ${location.pathname === link.path ? 'scale-100' : 'scale-0'}`} />
                </Link>
              ))}
              
              <div className="mt-12 pt-12 border-t border-neutral-bg">
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] mb-6">Atendimento</p>
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
