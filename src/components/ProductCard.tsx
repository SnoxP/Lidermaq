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
      className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-bg dark:border-white/5 group shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/produto/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-neutral-bg dark:bg-neutral-700">
        <img 
          src={product.image || 'https://picsum.photos/seed/lidermaq-placeholder/800/600'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
            {product.category || 'Geral'}
          </span>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{product.brand || 'Lidermaq'}</span>
        </div>
        <Link to={`/produto/${product.id}`}>
          <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-1 dark:text-white">
            {product.name || 'Produto sem nome'}
          </h3>
        </Link>
        <p className="text-sm text-primary/60 dark:text-white/60 mb-4 line-clamp-2">
          {product.description || 'Sem descrição disponível.'}
        </p>
        
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-xs text-primary/40 dark:text-white/40 uppercase font-bold tracking-tighter">A partir de</span>
            <span className="text-xl font-bold text-primary dark:text-white">
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
                className="w-10 h-10 bg-neutral-bg dark:bg-white/5 rounded-full flex items-center justify-center text-primary dark:text-white hover:bg-accent hover:text-white transition-all"
                title="Editar Produto"
              >
                <Edit2 size={18} />
              </Link>
            )}
            <Link 
              to={`/produto/${product.id}`}
              className="w-10 h-10 bg-neutral-bg dark:bg-white/5 rounded-full flex items-center justify-center text-primary dark:text-white hover:bg-accent hover:text-white transition-all"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
