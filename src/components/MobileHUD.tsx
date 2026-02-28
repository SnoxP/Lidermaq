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
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xs">
      <div className="bg-white/95 backdrop-blur-3xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-[2rem] p-1 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/30 flex-[1.4]' 
                  : 'text-primary/40 hover:text-primary/70 flex-1'
              }`}
            >
              <item.icon size={isActive ? 18 : 16} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="text-[7px] font-black uppercase tracking-widest mt-1">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
