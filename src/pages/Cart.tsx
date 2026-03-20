import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';

import { formatCurrency } from '../utils/format';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
        <SEO title="Carrinho de Compras" />
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
          <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
            <Link to="/" className="hover:text-accent transition-colors">Início</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-zinc-900 dark:text-white font-medium">Carrinho</span>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center py-20">
          <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 text-zinc-300 dark:text-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 dark:text-white font-display">SEU CARRINHO ESTÁ VAZIO</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            Explore nosso catálogo e adicione os equipamentos que você precisa para o seu negócio.
          </p>
          <Link to="/catalogo" className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors inline-flex">
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO title="Carrinho de Compras" />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Carrinho</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter dark:text-white font-display">MEU CARRINHO</h1>
          <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            {totalItems} {totalItems === 1 ? 'Item' : 'Itens'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-zinc-200 dark:border-zinc-800 shadow-sm"
              >
                <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-950 rounded-xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight mb-1">{item.name}</h3>
                      {item.variant && <p className="text-sm text-zinc-500 dark:text-zinc-400">Opção: {item.variant}</p>}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-accent hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-zinc-900 dark:text-white text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-accent hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-black text-accent text-xl font-display">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-32">
              <h2 className="text-xl font-black mb-6 dark:text-white font-display">RESUMO DO PEDIDO</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400 text-sm">
                  <span>Subtotal ({totalItems} itens)</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-end">
                  <span className="font-bold text-zinc-900 dark:text-white">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-accent font-display leading-none block">
                      {formatCurrency(totalPrice)}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">
                      em até 10x sem juros
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 mt-8"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
