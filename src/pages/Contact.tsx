import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BotVerification } from '../components/BotVerification';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Contact = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Por favor, complete a verificação de segurança.");
      return;
    }
    
    setStatus('sending');
    
    // Simulação de envio
    setTimeout(() => {
      setStatus('success');
      // Resetar formulário seria ideal aqui
    }, 1500);
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO 
        title="Fale Conosco"
        description="Entre em contato com a Lidermaq Equipamentos. Estamos prontos para tirar suas dúvidas e ajudar você a escolher o equipamento perfeito."
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Institucional</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Fale Conosco</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 dark:text-white font-display">FALE CONOSCO</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">Estamos prontos para tirar suas dúvidas e ajudar você a escolher o equipamento perfeito.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 dark:text-white font-display">Telefone</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">(89) 99917-0800 (Jonas)</p>
            <p className="text-zinc-600 dark:text-zinc-400">(89) 99986-1264 (Lena)</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-accent p-8 rounded-2xl text-center text-white shadow-xl shadow-accent/20"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 backdrop-blur-sm">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-black mb-6 font-display">WhatsApp</h3>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/5589999170800" className="bg-white text-accent px-6 py-3 rounded-xl font-bold hover:bg-zinc-50 transition-all text-sm shadow-sm flex items-center justify-center gap-2">
                Falar com Jonas
              </a>
              <a href="https://wa.me/5589999861264" className="bg-white text-accent px-6 py-3 rounded-xl font-bold hover:bg-zinc-50 transition-all text-sm shadow-sm flex items-center justify-center gap-2">
                Falar com Lena
              </a>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 dark:text-white font-display">E-mail</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">vendas@lidermaq.com.br</p>
            <p className="text-zinc-600 dark:text-zinc-400">sac@lidermaq.com.br</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900 p-8 lg:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300"
          >
            <h2 className="text-3xl font-black tracking-tighter mb-8 dark:text-white font-display">ENVIE UMA MENSAGEM</h2>
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black dark:text-white">Mensagem Enviada!</h3>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-xs">
                  Obrigado pelo contato. Retornaremos o mais breve possível.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-accent font-bold hover:underline"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-zinc-900 dark:text-white">Nome Completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-zinc-900 dark:text-white">E-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-zinc-900 dark:text-white">Assunto</label>
                  <select 
                    id="subject" 
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="vendas">Dúvida sobre Produto/Vendas</option>
                    <option value="assistencia">Assistência Técnica</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-zinc-900 dark:text-white">Mensagem</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                    placeholder="Como podemos ajudar?"
                    required
                  ></textarea>
                </div>

                <BotVerification onVerify={setIsVerified} />

                <button 
                  type="submit" 
                  disabled={status === 'sending' || !isVerified}
                  className="w-full bg-accent text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
              <h3 className="text-2xl font-black mb-6 dark:text-white font-display">NOSSA LOJA</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Endereço</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Av. Senador Helvídio Nunes, N°4731<br />
                      Bairro Junco, Picos - PI<br />
                      CEP: 64600-000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Horário de Funcionamento</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Segunda a Sexta: 08:00 às 18:00<br />
                      Sábado: 08:00 às 12:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden h-[300px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative group">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none z-10" />
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.537651817769!2d-41.45501862412847!3d-7.062086992939943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7a306873534a179%3A0x8e8db6237c041f02!2sLidermaq%20Equipamentos!5e0!3m2!1spt-BR!2sbr!4v1709666014494!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.2] contrast-125 dark:invert-[0.9] dark:hue-rotate-180 transition-all duration-500"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
