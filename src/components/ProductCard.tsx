import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="card-premium group"
    >
      <Link to={`/produto/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={product.image || 'https://picsum.photos/seed/lidermaq-placeholder/800/600'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
            {product.category || 'Geral'}
          </span>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{product.brand || 'Lidermaq'}</span>
        </div>
        <Link to={`/produto/${product.id}`}>
          <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-1 dark:text-white font-display">
            {product.name || 'Produto sem nome'}
          </h3>
        </Link>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
          {product.description || 'Sem descrição disponível.'}
        </p>
        
        <div className="flex items-end justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
          <div>
            <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">A partir de</span>
            <span className="text-xl font-black text-zinc-900 dark:text-white font-display">
              R$ {(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="block text-xs text-accent font-semibold mt-1">
              {product.installments || 'Consulte condições'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link 
                to={`/admin/editar-produto/${product.id}`}
                className="w-10 h-10 bg-zinc-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-accent hover:text-white transition-all"
                title="Editar Produto"
              >
                <Edit2 size={18} />
              </Link>
            )}
            <Link 
              to={`/produto/${product.id}`}
              className="w-10 h-10 bg-zinc-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-accent hover:text-white transition-all"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
