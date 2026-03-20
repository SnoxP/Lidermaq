import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { SEO } from '../components/SEO';
import { ChevronRight, AlertTriangle, CreditCard, MapPin, User, Mail, Hash, QrCode, Barcode, CheckCircle2 } from 'lucide-react';

export const Checkout = () => {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        cep: user.cep || '',
        street: user.street || '',
        number: user.number || '',
        neighborhood: user.neighborhood || '',
        city: user.city || '',
        state: user.state || '',
      });
    }
  }, [user, navigate]);

  if (!user) return null;

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
        <SEO title="Checkout - Lidermaq" />
        <div className="container mx-auto px-4 text-center py-20">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 dark:text-white font-display">SEU CARRINHO ESTÁ VAZIO</h1>
          <Link to="/catalogo" className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors inline-flex">
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20 flex items-center justify-center">
        <SEO title="Pedido Confirmado - Lidermaq" />
        <div className="container mx-auto px-4 text-center py-20 max-w-lg">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 dark:text-white font-display">PEDIDO CONFIRMADO!</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Seu pedido foi processado com sucesso. Em breve você receberá um e-mail com os detalhes da entrega.
          </p>
          <Link to="/perfil" className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors inline-flex w-full justify-center">
            Acompanhar Pedido
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
      clearCart();
    }, 2000);
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO title="Checkout - Lidermaq" />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/carrinho" className="hover:text-accent transition-colors">Carrinho</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Pagamento</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {!user.isAdmin && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 mb-8 flex items-start gap-4">
            <div className="bg-amber-100 dark:bg-amber-500/20 p-2 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-1">Página em Desenvolvimento</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400/80">
                O sistema de pagamento online está sendo implementado. No momento, esta página é apenas uma demonstração.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-2xl font-black mb-6 dark:text-white font-display flex items-center gap-3">
                <User className="text-accent" />
                DADOS PESSOAIS
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Telefone (WhatsApp)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-2xl font-black mb-6 dark:text-white font-display flex items-center gap-3">
                <MapPin className="text-accent" />
                ENDEREÇO DE ENTREGA
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">CEP</label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Rua</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Número</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Bairro</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Estado</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {user.isAdmin && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-2xl font-black mb-6 dark:text-white font-display flex items-center gap-3">
                  <CreditCard className="text-accent" />
                  PAGAMENTO
                </h2>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-accent/50 dark:text-zinc-400'
                    }`}
                  >
                    <CreditCard size={24} />
                    <span className="text-sm font-bold text-center">Cartão</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-emerald-500/50 dark:text-zinc-400'
                    }`}
                  >
                    <QrCode size={24} />
                    <span className="text-sm font-bold text-center">Pix</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'boleto'
                        ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-900/50 dark:hover:border-white/50 dark:text-zinc-400'
                    }`}
                  >
                    <Barcode size={24} />
                    <span className="text-sm font-bold text-center">Boleto</span>
                  </button>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-900 dark:text-white">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-900 dark:text-white">Nome Impresso no Cartão</label>
                      <input
                        type="text"
                        placeholder="NOME DO TITULAR"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-bold text-zinc-900 dark:text-white">Parcelamento</label>
                      <select className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all">
                        <option>1x de R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>2x de R$ {(totalPrice / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>3x de R$ {(totalPrice / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>4x de R$ {(totalPrice / 4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>5x de R$ {(totalPrice / 5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>6x de R$ {(totalPrice / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                    <QrCode size={48} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-4" />
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">Pagamento via Pix</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mb-4">
                      O código Pix será gerado após a finalização do pedido. Você terá 30 minutos para realizar o pagamento.
                    </p>
                    <div className="inline-block bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-lg font-bold text-sm">
                      Desconto de 5% aplicado
                    </div>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                    <Barcode size={48} className="mx-auto text-zinc-600 dark:text-zinc-400 mb-4" />
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Boleto Bancário</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      O boleto será gerado após a finalização do pedido. O prazo de compensação é de até 3 dias úteis após o pagamento.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg dark:text-white mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400 truncate pr-4">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium dark:text-white shrink-0">
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                  <span className="font-medium dark:text-white">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Frete</span>
                  <span className="text-emerald-500 font-medium">Grátis</span>
                </div>
                {paymentMethod === 'pix' && user.isAdmin && (
                  <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Desconto Pix (5%)</span>
                    <span className="font-medium">- R$ {(totalPrice * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-end">
                  <span className="font-bold text-zinc-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-accent font-display leading-none">
                    R$ {(paymentMethod === 'pix' && user.isAdmin ? totalPrice * 0.95 : totalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {user.isAdmin ? (
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Finalizar Pedido
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    disabled
                    className="w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 py-4 rounded-xl font-bold text-lg mt-6 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Pagar Agora
                  </button>
                  <p className="text-xs text-center text-zinc-500 mt-3">
                    O pagamento online estará disponível em breve.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
