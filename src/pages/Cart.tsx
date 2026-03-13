import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';
import { AttendantSelector } from '../components/AttendantSelector';

import { formatCurrency } from '../utils/format';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'attendant'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    paymentMethod: 'Pix'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartDetails = cart
    .map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ''} x${item.quantity} - R$ ${(
          item.price * item.quantity
        ).toLocaleString('pt-BR')}`
    )
    .join('\n');

  const message = `Olá Lidermaq! Gostaria de solicitar um pedido para os seguintes itens:\n\n${cartDetails}\n\nTotal: R$ ${totalPrice.toLocaleString(
    'pt-BR'
  )}\n\n*Dados do Cliente:*\nNome: ${formData.name}\nEmail: ${formData.email}\nTelefone: ${formData.phone}\n\n*Endereço de Entrega:*\nCEP: ${formData.cep}\nRua: ${formData.street}, Nº ${formData.number}\nComplemento: ${formData.complement || 'Nenhum'}\n\n*Método de Pagamento:* ${formData.paymentMethod}`;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/carrinho');
      return;
    }
    setCheckoutStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('attendant');
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
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shrink-0 relative border border-zinc-200">
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
                  <img src={item.image} alt={item.name} className="relative w-full h-full object-contain" />
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
                    {formatCurrency(item.price)}
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
                  <span className="font-bold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Entrega</span>
                  <span className="text-emerald-500 font-bold uppercase text-xs tracking-widest">Grátis em Picos</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between items-end">
                  <span className="text-lg font-bold dark:text-white">Total</span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-accent font-display leading-none">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {checkoutStep === 'cart' && (
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full py-4 text-lg shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={24} /> Concluir Pedido
                  </button>
                )}

                {checkoutStep === 'form' && (
                  <form onSubmit={handleFormSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Contato</h4>
                      <input type="text" required placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all" />
                      <input type="email" required placeholder="E-mail (Gmail)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all" />
                      <input type="tel" required placeholder="Telefone / WhatsApp" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all" />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-white/5">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Endereço de Entrega</h4>
                      <input type="text" required placeholder="CEP" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all" />
                      <div className="flex gap-3">
                        <input type="text" required placeholder="Rua" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-2/3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all" />
                        <input type="text" required placeholder="Nº" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-1/3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all" />
                      </div>
                      <input type="text" placeholder="Complemento (Opcional)" value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all" />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-white/5">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Pagamento</h4>
                      <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none dark:text-white transition-all appearance-none">
                        <option value="Pix">Pix (Desconto de 5%)</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                        <option value="Cartão de Débito">Cartão de Débito</option>
                        <option value="Boleto">Boleto Bancário</option>
                        <option value="Dinheiro">Dinheiro</option>
                      </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setCheckoutStep('cart')} className="flex-1 py-4 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        Voltar
                      </button>
                      <button type="submit" className="flex-1 btn-primary py-4 shadow-lg shadow-accent/20">
                        Continuar
                      </button>
                    </div>
                  </form>
                )}
                
                {checkoutStep === 'attendant' && (
                  <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Falar com Vendedor</h4>
                      <button onClick={() => setCheckoutStep('form')} className="text-xs text-accent hover:underline">Editar Dados</button>
                    </div>
                    <AttendantSelector message={message} />
                  </div>
                )}
              </div>

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
