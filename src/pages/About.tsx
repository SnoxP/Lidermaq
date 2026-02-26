import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award, History } from 'lucide-react';

export const About = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-black tracking-tighter mb-6">NOSSA HISTÓRIA</h1>
          <p className="text-xl text-primary/60 leading-relaxed">
            Desde 1995, a Lidermaq impulsiona negócios com equipamentos que unem tecnologia de ponta, durabilidade excepcional e a eficiência que seu empreendimento merece.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/factory/800/600" alt="Nossa Fábrica" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter">QUALIDADE QUE VEM DE BERÇO</h2>
            <p className="text-primary/70 leading-relaxed">
              Fundada em Picos, Piauí, a Lidermaq nasceu do sonho de oferecer equipamentos de alto padrão com fabricação própria e curadoria rigorosa. Hoje, somos referência em toda a região, atendendo desde pequenos comércios até grandes indústrias e projetos corporativos.
            </p>
            <p className="text-primary/70 leading-relaxed">
              Nossa missão é simples: fornecer equipamentos que não sejam apenas ferramentas, mas partes fundamentais do seu sucesso. Por isso, investimos constantemente em tecnologia e na capacitação de nossa equipe técnica.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                  <Shield size={20} />
                </div>
                <span className="font-bold text-sm">Confiança</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                  <Award size={20} />
                </div>
                <span className="font-bold text-sm">Excelência</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-bg p-10 rounded-3xl text-center">
            <History className="text-accent mx-auto mb-6" size={40} />
            <h3 className="text-4xl font-black mb-2">30+</h3>
            <p className="text-primary/60 font-bold uppercase text-xs tracking-widest">Anos de Mercado</p>
          </div>
          <div className="bg-neutral-bg p-10 rounded-3xl text-center">
            <Users className="text-accent mx-auto mb-6" size={40} />
            <h3 className="text-4xl font-black mb-2">15k+</h3>
            <p className="text-primary/60 font-bold uppercase text-xs tracking-widest">Clientes Satisfeitos</p>
          </div>
          <div className="bg-neutral-bg p-10 rounded-3xl text-center">
            <Award className="text-accent mx-auto mb-6" size={40} />
            <h3 className="text-4xl font-black mb-2">100%</h3>
            <p className="text-primary/60 font-bold uppercase text-xs tracking-widest">Garantia de Qualidade</p>
          </div>
        </div>
      </div>
    </div>
  );
};
