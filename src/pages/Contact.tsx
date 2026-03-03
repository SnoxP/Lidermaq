import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact = () => {
  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 dark:text-white font-display">FALE CONOSCO</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">Estamos prontos para tirar suas dúvidas e ajudar você a escolher o equipamento perfeito.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <motion.div 
            whileHover={{ y: -5 }}
            className="card-premium p-10 text-center bg-white dark:bg-zinc-900"
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
            className="bg-accent p-10 rounded-[2rem] text-center text-white shadow-xl shadow-accent/20"
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
            className="card-premium p-10 text-center bg-white dark:bg-zinc-900"
          >
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 dark:text-white font-display">E-mail</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">vendas@lidermaq.com.br</p>
            <p className="text-zinc-600 dark:text-zinc-400">sac@lidermaq.com.br</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-xl transition-colors duration-300"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 dark:text-white font-display">ENVIE UMA MENSAGEM</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Nome Completo</label>
                  <input type="text" className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" placeholder="Ex: João Silva" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">WhatsApp / Telefone</label>
                  <input type="tel" className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" placeholder="(89) 99917-0800" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Assunto</label>
                <select className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-bold transition-all cursor-pointer">
                  <option>Orçamento de Equipamentos</option>
                  <option>Assistência Técnica</option>
                  <option>Dúvidas Gerais</option>
                  <option>Reclamações / SAC</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Mensagem</label>
                <textarea rows={5} className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none" placeholder="Como podemos ajudar?" required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-lg shadow-lg shadow-accent/20">Enviar Mensagem</button>
            </form>
          </motion.div>

          {/* Map & Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-xl transition-colors duration-300">
              <h3 className="text-3xl font-black tracking-tighter mb-8 dark:text-white font-display">ONDE ESTAMOS</h3>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white mb-1">Endereço</p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Próximo à concessionária FIAT<br />
                      Av. Senador Helvídio Nunes, N°4731<br />
                      Junco, Picos - PI, 64607-755
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white mb-1">Horário de Atendimento</p>
                    <p className="text-zinc-600 dark:text-zinc-400">Segunda a Sexta: 08:00 às 18:00</p>
                    <p className="text-zinc-600 dark:text-zinc-400">Sábado: 08:00 às 12:00</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 border border-zinc-200 dark:border-white/5">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.706061141118!2d-41.472758!3d-7.078234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xbac246e3a606b9b8!2sLiderMaq%20Equipamentos!5e0!3m2!1spt-BR!2sbr!4v1645789000000!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
