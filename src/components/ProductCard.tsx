import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Edit2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export interface ProductCardProps {
  product: Product;
  gridCols?: number;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, gridCols = 1 }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="card-premium group product-card-item"
    >
      <Link to={`/produto/${product.id}`} className="block relative aspect-square overflow-hidden bg-white">
        {/* Adaptive Background */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${product.image || 'https://picsum.photos/seed/lidermaq-placeholder/800/600'})`,
            backgroundSize: '5000% 5000%',
            backgroundPosition: '2% 2%',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <img 
          src={product.image || 'https://picsum.photos/seed/lidermaq-placeholder/800/600'} 
          alt={product.name}
          className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute ${gridCols >= 3 ? 'top-2 left-2 sm:top-4 sm:left-4' : 'top-4 left-4'} ${gridCols >= 3 ? 'hidden sm:block' : ''}`}>
          <span className={`bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-white ${gridCols >= 3 ? 'text-[8px] px-2 py-0.5 sm:text-[10px] sm:px-3 sm:py-1' : 'text-[10px] px-3 py-1'} font-black uppercase tracking-widest rounded-full border border-white/20`}>
            {product.category || 'Geral'}
          </span>
        </div>
      </Link>
      
      <div className={`${gridCols >= 3 ? 'p-2 sm:p-6' : gridCols === 2 ? 'p-3 sm:p-6' : 'p-6'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`${gridCols >= 4 ? 'text-[7px] sm:text-[10px]' : gridCols === 3 ? 'text-[8px] sm:text-[10px]' : 'text-[10px]'} font-bold text-accent uppercase tracking-widest line-clamp-1`}>{product.brand || 'Lidermaq'}</span>
        </div>
        <Link to={`/produto/${product.id}`}>
          <h3 className={`${gridCols >= 4 ? 'text-xs sm:text-lg' : gridCols === 3 ? 'text-sm sm:text-lg' : gridCols === 2 ? 'text-base sm:text-lg' : 'text-lg'} font-bold mb-2 group-hover:text-accent transition-colors line-clamp-1 dark:text-white font-display`}>
            {product.name || 'Produto sem nome'}
          </h3>
        </Link>
        <div className={`${gridCols >= 2 ? 'hidden sm:block' : 'block'} mb-4`}>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {product.description || 'Sem descrição disponível.'}
          </p>
        </div>
        
        <div className={`flex ${gridCols >= 3 ? 'flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between' : gridCols === 2 ? 'flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between' : 'items-end justify-between'} pt-3 sm:pt-4 border-t border-zinc-100 dark:border-white/5`}>
          <div>
            <span className={`block ${gridCols >= 4 ? 'text-[7px] sm:text-[10px]' : gridCols === 3 ? 'text-[8px] sm:text-[10px]' : 'text-[10px]'} text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest mb-0.5 sm:mb-1`}>A partir de</span>
            <span className={`${gridCols >= 4 ? 'text-xs sm:text-xl' : gridCols === 3 ? 'text-sm sm:text-xl' : gridCols === 2 ? 'text-lg sm:text-xl' : 'text-xl'} font-black text-zinc-900 dark:text-white font-display whitespace-nowrap`}>
              R$ {(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className={`${gridCols >= 4 ? 'text-[7px] sm:text-xs' : gridCols === 3 ? 'text-[9px] sm:text-xs' : 'text-xs'} text-accent font-semibold mt-0.5 sm:mt-1 line-clamp-1`}>
              {product.installments || 'Consulte condições'}
            </span>
          </div>
          
            <div className={`flex items-center ${gridCols >= 4 ? 'gap-1 sm:gap-2' : gridCols === 3 ? 'gap-1 sm:gap-2' : 'gap-2'} w-full sm:w-auto justify-end mt-2 sm:mt-0`}>
              <button 
                onClick={handleAddToCart}
                className={`${gridCols >= 4 ? 'w-7 h-7 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl' : gridCols === 3 ? 'w-8 h-8 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl' : 'w-10 h-10 rounded-xl'} bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-accent hover:text-white transition-all`}
                title="Adicionar ao Carrinho"
              >
                <ShoppingBag className={`${gridCols >= 4 ? 'w-3 h-3 sm:w-[18px] sm:h-[18px]' : gridCols === 3 ? 'w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]' : 'w-[18px] h-[18px]'}`} />
              </button>
              {isAdmin && (
                <Link 
                  to={`/admin/editar-produto/${product.id}`}
                  className={`${gridCols >= 4 ? 'w-7 h-7 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl' : gridCols === 3 ? 'w-8 h-8 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl' : 'w-10 h-10 rounded-xl'} bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-accent hover:text-white transition-all`}
                  title="Editar Produto"
                >
                  <Edit2 className={`${gridCols >= 4 ? 'w-3 h-3 sm:w-[18px] sm:h-[18px]' : gridCols === 3 ? 'w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]' : 'w-[18px] h-[18px]'}`} />
                </Link>
              )}
              <Link 
                to={`/produto/${product.id}`}
                className={`${gridCols >= 4 ? 'w-7 h-7 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl' : gridCols === 3 ? 'w-8 h-8 rounded-lg sm:w-10 sm:h-10 sm:rounded-xl' : 'w-10 h-10 rounded-xl'} bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-accent hover:text-white transition-all`}
              >
                <ArrowRight className={`${gridCols >= 4 ? 'w-3 h-3 sm:w-5 sm:h-5' : gridCols === 3 ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5'}`} />
              </Link>
            </div>
        </div>
      </div>
    </motion.div>
  );
});
