import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, ShieldCheck, MessageCircle, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Assistencia = () => {
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
    <div className="pt-32 pb-20">
      <SEO 
        title="Assistência Técnica Especializada - Lidermaq"
        description="Suporte técnico especializado para equipamentos de padarias, restaurantes e cozinhas industriais. Manutenção preventiva e corretiva com peças originais."
      />
      
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-6"
          >
            Suporte Pós-Venda
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tighter mb-6"
          >
            ASSISTÊNCIA TÉCNICA <br />
            <span className="text-accent">ESPECIALIZADA</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-primary/60 leading-relaxed"
          >
            Garantimos o pleno funcionamento do seu negócio com uma equipe técnica pronta para atender você com agilidade e peças originais de fábrica.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-bg p-10 rounded-3xl border border-transparent hover:border-accent/20 transition-all group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-accent mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-primary/60 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact & Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-black tracking-tighter">SOLICITE UM <br />ATENDIMENTO</h2>
            <p className="text-primary/60 text-lg">
              Preencha o formulário ao lado ou entre em contato diretamente pelos nossos canais de suporte. Atendemos em toda a região de Picos e arredores.
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-neutral-bg">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Telefone Suporte</p>
                  <p className="font-bold">(89) 99917-0800</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-neutral-bg">
                <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">WhatsApp Técnico</p>
                  <p className="font-bold">(89) 99986-1264</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-neutral-bg">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">E-mail Técnico</p>
                  <p className="font-bold">suporte@lidermaq.com.br</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary text-white rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-accent" size={24} />
                <h4 className="font-bold">Horário do Suporte</h4>
              </div>
              <p className="text-white/60 text-sm">
                Segunda a Sexta: 08:00 às 18:00 <br />
                Sábado: 08:00 às 12:00
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-3xl shadow-xl border border-neutral-bg"
          >
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/40">Nome ou Empresa</label>
                <input type="text" className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Seu nome completo" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/40">WhatsApp</label>
                  <input type="tel" className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="(89) 99917-0800" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/40">Equipamento</label>
                  <input type="text" className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Ex: Forno Turbo" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/40">Descrição do Problema</label>
                <textarea rows={4} className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Descreva o que está acontecendo..." required></textarea>
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-lg shadow-lg shadow-accent/20">
                Enviar Solicitação
              </button>
              
              <p className="text-center text-xs text-primary/40 mt-4">
                Retornaremos seu contato em até 2 horas úteis.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
