import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';
import { AttendantSelector } from '../components/AttendantSelector';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAttendantSelector, setShowAttendantSelector] = React.useState(false);

  const cartDetails = cart
    .map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ''} x${item.quantity} - R$ ${(
          item.price * item.quantity
        ).toLocaleString('pt-BR')}`
    )
    .join('\n');

  const message = `Olá Lidermaq! Gostaria de solicitar um orçamento para os seguintes itens:\n\n${cartDetails}\n\nTotal: R$ ${totalPrice.toLocaleString(
    'pt-BR'
  )}\n\nCliente: ${user?.email || 'Visitante'}`;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/carrinho');
      return;
    }
    setShowAttendantSelector(true);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 text-zinc-400">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-4 dark:text-white font-display">SEU CARRINHO ESTÁ VAZIO</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            Explore nosso catálogo e adicione os equipamentos que você precisa para o seu negócio.
          </p>
          <Link to="/catalogo" className="btn-primary inline-flex">
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO title="Carrinho de Compras" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-black tracking-tighter dark:text-white font-display">MEU CARRINHO</h1>
          <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            {totalItems} {totalItems === 1 ? 'Item' : 'Itens'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                layout
                key={`${item.id}-${item.variant}`}
                className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold dark:text-white font-display leading-tight mb-1">
                    {item.name}
                  </h3>
                  {item.variant && (
                    <p className="text-xs text-accent font-bold uppercase tracking-widest mb-2">
                      {item.variant}
                    </p>
                  )}
                  <p className="text-xl font-black text-zinc-900 dark:text-white font-display">
                    R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-accent transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold dark:text-white text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-accent transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id, item.variant)}
                    className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}

            <Link to="/catalogo" className="inline-flex items-center gap-2 text-zinc-500 hover:text-accent font-bold mt-4 transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Continuar Comprando
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-xl sticky top-32">
              <h3 className="text-2xl font-black tracking-tighter mb-8 dark:text-white font-display">RESUMO DO PEDIDO</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-bold">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Entrega</span>
                  <span className="text-emerald-500 font-bold uppercase text-xs tracking-widest">Grátis em Picos</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between items-end">
                  <span className="text-lg font-bold dark:text-white">Total</span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-accent font-display leading-none">
                      R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-4 text-lg shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
              >
                <MessageCircle size={24} /> Finalizar Orçamento
              </button>
              
              {showAttendantSelector && (
                <div className="mt-6 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10">
                  <AttendantSelector message={message} />
                </div>
              )}
              
              {!user && (
                <p className="text-[10px] text-center text-zinc-400 mt-4 uppercase font-bold tracking-widest">
                  * É necessário estar logado para finalizar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
