import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { SEO } from '../components/SEO';
import { ChevronRight, AlertTriangle, CreditCard, MapPin, User, Mail, Hash, QrCode, Barcode, CheckCircle2, Tag, X } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const Checkout = () => {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
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
    birthDate: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discountPercentage: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else if (!hasInitialized.current) {
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
        birthDate: user.birthDate || '',
      });
      hasInitialized.current = true;
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    try {
      const code = couponCode.toUpperCase().trim();
      const couponRef = doc(db, 'coupons', code);
      const couponSnap = await getDoc(couponRef);
      
      if (couponSnap.exists()) {
        const data = couponSnap.data();
        if (data.active) {
          setAppliedCoupon({ code: data.code, discountPercentage: data.discountPercentage });
          setCouponCode('');
        } else {
          setCouponError('Este cupom não está mais ativo.');
        }
      } else {
        setCouponError('Cupom inválido.');
      }
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      setCouponError('Erro ao verificar cupom.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let newCep = e.target.value.replace(/\D/g, '');
    if (newCep.length > 8) newCep = newCep.slice(0, 8);
    
    let formattedCep = newCep;
    if (newCep.length > 5) {
      formattedCep = `${newCep.slice(0, 5)}-${newCep.slice(5)}`;
    }
    
    setFormData(prev => ({ ...prev, cep: formattedCep }));

    if (newCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${newCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    let formatted = value;
    if (value.length > 4) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    
    setFormData(prev => ({ ...prev, birthDate: formatted }));
  };

  const validateAge = (dateString: string) => {
    if (dateString.length !== 10) return false;
    const [day, month, year] = dateString.split('/');
    
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) {
      return false;
    }
    
    const birth = new Date(y, m - 1, d);
    if (birth.getDate() !== d || birth.getMonth() !== m - 1 || birth.getFullYear() !== y) {
      return false;
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleCheckout = async () => {
    if (!formData.birthDate || formData.birthDate.length !== 10 || !validateAge(formData.birthDate)) {
      alert('Você precisa ter pelo menos 18 anos e informar uma data de nascimento válida para finalizar a compra.');
      return;
    }
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
      clearCart();
    }, 2000);
  };

  const discountAmount = appliedCoupon ? (total * (appliedCoupon.discountPercentage / 100)) : 0;
  const finalTotal = total - discountAmount;

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
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white">Data de Nascimento</label>
                  <input
                    type="text"
                    value={formData.birthDate}
                    onChange={handleBirthDateChange}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
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
                    onChange={handleCepChange}
                    placeholder="00000-000"
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

                <div className="grid grid-cols-2 gap-4 mb-8">
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
                        <option>1x de R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>2x de R$ {(total / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>3x de R$ {(total / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>4x de R$ {(total / 4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>5x de R$ {(total / 5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                        <option>6x de R$ {(total / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                    <QrCode size={48} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-4" />
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">Pagamento via Pix</h3>
                    <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mb-4">
                      R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <img 
                      src="https://i.ibb.co/BHDxCTqj/qrcode-pix.png" 
                      alt="QR Code Pix" 
                      className="mx-auto w-48 h-48 mb-4 rounded-lg border border-emerald-200"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-sm text-emerald-800 dark:text-emerald-300 font-bold mb-2">Chave Pix:</p>
                    <div className="bg-white dark:bg-zinc-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-500/30 text-xs font-mono break-all text-emerald-900 dark:text-emerald-200 mb-4">
                      00020126580014BR.GOV.BCB.PIX013695b230e1-a1bb-4ef1-9151-546f45879d055204000053039865802BR5901N6001C62070503***63047CF0
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400/80">
                      Copie a chave ou escaneie o QR Code acima para realizar o pagamento.
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
                  <span className="font-medium dark:text-white">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Frete</span>
                  <span className="text-emerald-500 font-medium">Grátis</span>
                </div>

                {user.isAdmin && (
                  <div className="pt-2 pb-2">
                    {!appliedCoupon ? (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Tag size={16} /> Cupom de Desconto
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Digite seu cupom"
                            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all uppercase"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon || !couponCode.trim()}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50"
                          >
                            {isApplyingCoupon ? '...' : 'Aplicar'}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                      </div>
                    ) : (
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <Tag size={16} />
                          <div>
                            <p className="text-sm font-bold uppercase">{appliedCoupon.code}</p>
                            <p className="text-xs">{appliedCoupon.discountPercentage}% de desconto</p>
                          </div>
                        </div>
                        <button onClick={removeCoupon} className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Desconto ({appliedCoupon.discountPercentage}%)</span>
                    <span className="font-medium">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-end">
                  <span className="font-bold text-zinc-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-accent font-display leading-none">
                    R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
