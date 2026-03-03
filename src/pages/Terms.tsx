import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Terms = () => {
  return (
    <div className="pt-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO 
        title="Termos de Uso"
        description="Termos e condições de uso dos serviços e produtos da Lidermaq."
      />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/90 to-zinc-900 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80" 
            alt="Termos de Uso" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-md text-accent text-xs font-bold uppercase tracking-[0.3em] rounded-full mb-6 border border-accent/30">
                Regras e Condições
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white font-display">
                TERMOS DE <span className="text-accent">USO</span>
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                Ao utilizar nossos serviços e adquirir nossos produtos, você concorda com os termos e condições abaixo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-30 pb-20">
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-xl space-y-12 border border-zinc-100 dark:border-white/5">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">1. Aceitação dos Termos</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              Ao acessar e usar o site da Lidermaq Equipamentos, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site ou serviços.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">2. Uso do Catálogo e Orçamentos</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              Nosso catálogo online serve como uma vitrine virtual de nossos produtos. Os preços e a disponibilidade estão sujeitos a alterações sem aviso prévio. A solicitação de orçamento via WhatsApp não configura uma compra finalizada; a venda só é concretizada após a confirmação de pagamento e emissão da nota fiscal.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">3. Garantia e Assistência Técnica</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              Todos os equipamentos novos comercializados pela Lidermaq possuem garantia de fábrica, cujo prazo varia conforme o fabricante e o tipo de equipamento. A assistência técnica dentro do prazo de garantia deve ser solicitada através dos nossos canais oficiais de atendimento, mediante apresentação da nota fiscal de compra.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">4. Limitação de Responsabilidade</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              A Lidermaq não se responsabiliza por danos diretos, indiretos, incidentais ou consequentes resultantes do uso inadequado dos equipamentos adquiridos, ou da incapacidade de usar nosso site. As informações técnicas dos produtos são fornecidas pelos fabricantes e podem sofrer atualizações.
            </p>
          </section>

          <div className="pt-8 border-t border-neutral-bg dark:border-white/5 text-center">
            <p className="text-primary/40 dark:text-zinc-500 text-sm">
              Última atualização: Fevereiro de 2026. <br />
              Para dúvidas sobre nossos termos, entre em contato pelo e-mail: suporte@lidermaq.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
