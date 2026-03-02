import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award, History, ExternalLink } from 'lucide-react';
import { SEO } from '../components/SEO';

export const About = () => {
  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO 
        title="Nossa História"
        description="Conheça a trajetória da Lidermaq Equipamentos em Picos-PI. Mais de 10 anos de tradição e compromisso com o empreendedor."
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 dark:text-white font-display">NOSSA HISTÓRIA</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Com uma década de atuação, a Lidermaq se posiciona como uma empresa sólida no mercado piauiense, sendo reconhecida pela variedade de produtos e pelo atendimento próximo ao cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/5"
          >
            <img src="https://cidadesnanet.com/news/wp-content/uploads/2020/11/DSC_1452.jpg" alt="Nossa Fábrica" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter dark:text-white font-display">QUALIDADE QUE VEM DE BERÇO</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Segundo a matéria publicada no portal Cidades na Net, a empresa atua há cerca de 10 anos no mercado, consolidando-se como referência regional no fornecimento de equipamentos profissionais. Ao longo desse período, a Lidermaq construiu uma reputação baseada na confiança, no atendimento personalizado e na oferta de produtos de qualidade.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A empresa trabalha com uma ampla variedade de máquinas e equipamentos, incluindo itens para padarias, açougues, supermercados e cozinhas industriais. O diferencial da Lidermaq está no suporte oferecido aos clientes, ajudando empreendedores a montar, ampliar ou modernizar seus estabelecimentos com segurança no investimento.
            </p>
            <div className="pt-4">
              <a 
                href="https://cidadesnanet.com/news/municipios/picos/picos-conheca-a-lidermaq-que-atua-ha-10-anos-com-maquinas-e-equipamentos/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent font-bold hover:underline group"
              >
                Saiba mais sobre nossa história <ExternalLink size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-200 dark:border-white/5 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <Shield size={24} />
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">Confiança</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <Award size={24} />
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">Excelência</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="card-premium p-10 text-center bg-white dark:bg-zinc-900"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
              <History size={40} />
            </div>
            <h3 className="text-5xl font-black mb-2 dark:text-white font-display">10+</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">Anos de Mercado</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="card-premium p-10 text-center bg-white dark:bg-zinc-900"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
              <Users size={40} />
            </div>
            <h3 className="text-5xl font-black mb-2 dark:text-white font-display">15k+</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">Clientes Satisfeitos</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="card-premium p-10 text-center bg-white dark:bg-zinc-900"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
              <Award size={40} />
            </div>
            <h3 className="text-5xl font-black mb-2 dark:text-white font-display">100%</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">Garantia de Qualidade</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
