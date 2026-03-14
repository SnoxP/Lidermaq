import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, ShieldCheck, MessageCircle, Phone, Mail, CheckCircle2, CheckCircle, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { BotVerification } from '../components/BotVerification';
import { Link } from 'react-router-dom';

export const Assistencia = () => {
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

  const services = [
    {
      title: 'Manutenção Preventiva',
      description: 'Evite paradas inesperadas com revisões periódicas em seus equipamentos.',
      icon: ShieldCheck
    },
    {
      title: 'Reparos Especializados',
      description: 'Técnicos treinados pelas fábricas para resolver qualquer problema técnico.',
      icon: Wrench
    },
    {
      title: 'Peças Originais',
      description: 'Trabalhamos apenas com componentes genuínos para garantir a durabilidade.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO 
        title="Assistência Técnica Especializada - Lidermaq"
        description="Suporte técnico especializado para equipamentos de padarias, restaurantes e cozinhas industriais. Manutenção preventiva e corretiva com peças originais."
      />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Serviços</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Assistência Técnica</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Section with Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-6 border border-accent/20">
                Suporte Pós-Venda
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 dark:text-white font-display leading-tight">
                ASSISTÊNCIA TÉCNICA <br />
                <span className="text-accent">ESPECIALIZADA</span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                Garantimos o pleno funcionamento do seu negócio com uma equipe técnica pronta para atender você com agilidade e peças originais de fábrica.
              </p>
            </motion.div>
          </div>

          <div className="relative h-[400px] md:h-[500px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
            >
              <div className="w-full h-full rounded-xl overflow-hidden">
                <img 
                  src="https://instagram.fpcs1-1.fna.fbcdn.net/v/t51.82787-15/620411273_18146125075456641_4993748442091467742_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzgxNDMwOTY2NjUwODMzNjU3OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEyMDB4MTYwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=675IQzFTHbsQ7kNvwFhu6l9&_nc_oc=Adl-wzX8K8w18AfmjAhw8rYAy_wc9dz_eYzBJ011UOOKa8xaW1uULZ6n5dnPzHCwi3f0U2ep2Q0G42D0BfJY8ksL&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fpcs1-1.fna&_nc_gid=iUlULu96D3mN5gx8kZntcg&_nc_ss=8&oh=00_AfuXXnC6ek3SeufqkW8nVLxL0_03Ssc9e_QW2TIEaszRlA&oe=69A8C392" 
                  alt="Assistência Técnica Lidermaq" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm group hover:border-accent/50 transition-colors"
            >
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-black mb-3 dark:text-white font-display">{service.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900 p-8 lg:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <h2 className="text-3xl font-black tracking-tighter mb-8 dark:text-white font-display">SOLICITAR ATENDIMENTO</h2>
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black dark:text-white">Solicitação Enviada!</h3>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-xs">
                  Nossa equipe técnica entrará em contato em breve para agendar o atendimento.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-accent font-bold hover:underline"
                >
                  Fazer nova solicitação
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
                    <label htmlFor="phone" className="text-sm font-bold text-zinc-900 dark:text-white">Telefone/WhatsApp</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="equipment" className="text-sm font-bold text-zinc-900 dark:text-white">Equipamento</label>
                  <input 
                    type="text" 
                    id="equipment" 
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Ex: Forno Turbo, Amassadeira..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="problem" className="text-sm font-bold text-zinc-900 dark:text-white">Descrição do Problema</label>
                  <textarea 
                    id="problem" 
                    rows={4}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                    placeholder="Descreva o que está acontecendo com o equipamento"
                    required
                  ></textarea>
                </div>

                <BotVerification onVerify={setIsVerified} />

                <button 
                  type="submit" 
                  disabled={status === 'sending' || !isVerified}
                  className="w-full bg-accent text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                >
                  {status === 'sending' ? 'Enviando...' : 'Solicitar Atendimento'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-accent p-8 rounded-2xl text-white shadow-xl shadow-accent/20">
              <h3 className="text-2xl font-black mb-6 font-display">ATENDIMENTO URGENTE?</h3>
              <p className="mb-8 text-white/90 leading-relaxed">
                Para casos de emergência ou equipamentos parados, entre em contato diretamente pelo nosso WhatsApp para um atendimento mais rápido.
              </p>
              <a href="https://wa.me/5589999170800" className="bg-white text-accent px-8 py-4 rounded-xl font-bold hover:bg-zinc-50 transition-all shadow-sm flex items-center justify-center gap-3 w-full text-lg">
                <MessageCircle size={24} />
                Falar no WhatsApp
              </a>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-black mb-6 dark:text-white font-display">OUTROS CANAIS</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Telefone</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">(89) 99917-0800</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-1">E-mail</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">assistencia@lidermaq.com.br</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
