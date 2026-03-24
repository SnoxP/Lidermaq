import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';

export const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12">
      <SEO 
        title="Meus Favoritos | Lidermaq"
        description="Veja os produtos que você salvou como favoritos na Lidermaq."
      />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-accent" size={28} />
            <h1 className="text-3xl md:text-4xl font-black font-display dark:text-white uppercase tracking-tight">Meus Favoritos</h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            {favorites.length} {favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center shadow-sm border border-zinc-200 dark:border-zinc-800"
          >
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white mb-4">Sua lista está vazia</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
              Você ainda não adicionou nenhum produto aos seus favoritos. Navegue pelo nosso catálogo e salve os itens que você mais gostar!
            </p>
            <Link 
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-xl font-bold transition-colors uppercase tracking-wider text-sm"
            >
              <ShoppingBag size={18} />
              Explorar Catálogo
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} gridCols={4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
