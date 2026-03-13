import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AttendantSelector } from './AttendantSelector';
import { formatCurrency } from '../utils/format';

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAttendantSelector, setShowAttendantSelector] = React.useState(false);

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate('/login', { state: { from: 'cart' } });
      return;
    }
    setShowAttendantSelector(!showAttendantSelector);
  };

  const message = `Olá, gostaria de finalizar meu pedido:\n\n${cart.map(item => `${item.quantity}x ${item.name} - ${formatCurrency(item.price)}`).join('\n')}\n\nTotal: ${formatCurrency(total)}`;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 z-[110] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-black tracking-tight dark:text-white">Seu Carrinho</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors dark:text-zinc-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag size={48} className="mb-4 text-zinc-300 dark:text-zinc-600" />
                  <p className="text-lg font-bold dark:text-zinc-400">Seu carrinho está vazio</p>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">Adicione produtos para começar</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 relative border border-zinc-200">
                      {/* Adaptive Background */}
                      <div 
                        className="absolute inset-0 w-full h-full"
                        style={{
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: '5000% 5000%',
                          backgroundPosition: '2% 2%',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="relative w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1">{item.name}</h3>
                      <p className="text-accent font-black text-sm mb-2">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors dark:text-white"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors dark:text-white"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-100 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold">Total</span>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-accent text-white rounded-xl font-black tracking-wide hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                  >
                    <MessageCircle size={20} /> FINALIZAR PEDIDO
                  </button>
                  
                  {showAttendantSelector && (
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10">
                      <AttendantSelector message={message} />
                    </div>
                  )}
                </div>
                {!user && (
                  <p className="text-center text-xs text-zinc-400 mt-3">
                    Você precisará fazer login para finalizar a compra.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
