import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../data/mockData';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden border border-neutral-bg group shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/produto/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
            {product.category}
          </span>
        </div>
      </Link>
      
      <div className="p-6">
        <Link to={`/produto/${product.id}`}>
          <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-primary/60 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-xs text-primary/40 uppercase font-bold tracking-tighter">A partir de</span>
            <span className="text-xl font-bold text-primary">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="block text-xs text-accent font-semibold mt-1">
              {product.installments}
            </span>
          </div>
          
          <Link 
            to={`/produto/${product.id}`}
            className="w-10 h-10 bg-neutral-bg rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
