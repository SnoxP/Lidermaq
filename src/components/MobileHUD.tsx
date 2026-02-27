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
    <div className="lg:hidden fixed bottom-6 left-4 right-4 z-[100]">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                isActive ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-primary/40'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
