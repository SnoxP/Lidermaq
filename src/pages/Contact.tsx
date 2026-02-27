import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-6">FALE CONOSCO</h1>
          <p className="text-xl text-primary/60">Estamos prontos para tirar suas dúvidas e ajudar você a escolher o móvel perfeito.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-neutral-bg p-10 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Telefone</h3>
            <p className="text-primary/60 mb-2">(89) 99917-0800 (Jonas)</p>
            <p className="text-primary/60">(89) 99986-1264 (Lena)</p>
          </div>
          <div className="bg-accent p-10 rounded-3xl text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">WhatsApp</h3>
            <div className="flex flex-col gap-2 mb-6">
              <a href="https://wa.me/5589999170800" className="bg-white text-accent px-6 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all text-sm">
                Falar com Jonas
              </a>
              <a href="https://wa.me/5589999861264" className="bg-white text-accent px-6 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all text-sm">
                Falar com Lena
              </a>
            </div>
          </div>
          <div className="bg-neutral-bg p-10 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">E-mail</h3>
            <p className="text-primary/60 mb-2">vendas@lidermaq.com.br</p>
            <p className="text-primary/60">sac@lidermaq.com.br</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <div className="bg-white p-10 rounded-3xl border border-neutral-bg shadow-sm">
            <h2 className="text-3xl font-black tracking-tighter mb-8">ENVIE UMA MENSAGEM</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/40">Nome Completo</label>
                  <input type="text" className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Ex: João Silva" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/40">WhatsApp / Telefone</label>
                  <input type="tel" className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="(89) 99917-0800" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/40">Assunto</label>
                <select className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-semibold">
                  <option>Orçamento de Móveis</option>
                  <option>Assistência Técnica</option>
                  <option>Dúvidas Gerais</option>
                  <option>Reclamações / SAC</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/40">Mensagem</label>
                <textarea rows={5} className="w-full px-6 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="Como podemos ajudar?" required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-lg">Enviar Mensagem</button>
            </form>
          </div>

          {/* Map & Info */}
          <div className="space-y-8">
            <div className="bg-neutral-bg p-10 rounded-3xl">
              <h3 className="text-2xl font-black tracking-tighter mb-6">ONDE ESTAMOS</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-accent shrink-0" size={24} />
                  <p className="text-primary/60">Av. Principal, 1234 - Centro, Picos - PI, 64600-000</p>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="text-accent shrink-0" size={24} />
                  <div>
                    <p className="text-primary font-bold">Horário de Atendimento:</p>
                    <p className="text-primary/60">Segunda a Sexta: 08:00 às 18:00</p>
                    <p className="text-primary/60">Sábado: 08:00 às 12:00</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 border border-white/20">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15886.824244584485!2d-41.472758!3d-7.078234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDQnNDEuNiJTIDQxwrAyOCcyMS45Ilc!5e0!3m2!1spt-BR!2sbr!4v1645789000000!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
