import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, MessageSquare, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const MobileHUD = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Package, label: 'Catálogo', path: '/catalogo' },
    { icon: MessageSquare, label: 'Contato', path: '/contato' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  // Se for admin, adiciona o painel
  if (user?.isAdmin) {
    navItems.splice(2, 0, { icon: LayoutDashboard, label: 'Admin', path: '/admin' });
  }

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-1.5 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-3 px-1 rounded-[2rem] transition-all duration-300 ${
                isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105' 
                  : 'text-primary/30 hover:text-primary/60'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] font-bold uppercase tracking-tighter mt-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
