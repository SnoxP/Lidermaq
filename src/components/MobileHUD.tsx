import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Headset, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const MobileHUD = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Package, label: 'Catálogo', path: '/catalogo' },
    { icon: Headset, label: 'Suporte', path: '/assistencia' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  // Se for admin, adiciona o painel
  if (user?.isAdmin) {
    navItems.splice(2, 0, { icon: LayoutDashboard, label: 'Admin', path: '/admin' });
  }

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xs">
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2rem] p-1.5 flex items-center justify-around transition-all duration-500">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/60 dark:bg-white/10 text-accent shadow-sm' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-accent'
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-widest mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
