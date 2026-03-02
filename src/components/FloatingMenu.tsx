import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const FloatingMenu = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Catálogo', path: '/catalogo', icon: Grid },
    { name: 'Contato', path: '/contato', icon: Phone },
    { name: 'Perfil', path: '/perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 lg:hidden">
      <div className="bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-full shadow-2xl shadow-black/10 p-2 flex items-center justify-between relative overflow-hidden">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
        
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative z-10 flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'text-white shadow-lg shadow-accent/30' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/20 dark:hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-br from-accent to-orange-600 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={24} className={isActive ? 'drop-shadow-md' : ''} />
              <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-500'}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
