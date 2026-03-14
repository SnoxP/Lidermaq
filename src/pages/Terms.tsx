import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, AlertCircle, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export const Terms = () => {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO 
        title="Termos de Uso - Lidermaq"
        description="Termos e condições de uso dos serviços e produtos da Lidermaq."
      />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Termos de Uso</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 dark:text-white font-display">
            TERMOS DE <span className="text-accent">USO</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Ao utilizar nossos serviços e adquirir nossos produtos, você concorda com os termos e condições abaixo.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">1. Aceitação dos Termos</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ao acessar e usar o site da Lidermaq Equipamentos, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site ou serviços.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">2. Uso do Catálogo e Orçamentos</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Nosso catálogo online serve como uma vitrine virtual de nossos produtos. Os preços e a disponibilidade estão sujeitos a alterações sem aviso prévio. A solicitação de orçamento via WhatsApp não configura uma compra finalizada; a venda só é concretizada após a confirmação de pagamento e emissão da nota fiscal.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">3. Garantia e Assistência Técnica</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Todos os equipamentos novos comercializados pela Lidermaq possuem garantia de fábrica, cujo prazo varia conforme o fabricante e o tipo de equipamento. A assistência técnica dentro do prazo de garantia deve ser solicitada através dos nossos canais oficiais de atendimento, mediante apresentação da nota fiscal de compra.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">4. Limitação de Responsabilidade</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A Lidermaq não se responsabiliza por danos diretos, indiretos, incidentais ou consequentes resultantes do uso inadequado dos equipamentos adquiridos, ou da incapacidade de usar nosso site. As informações técnicas dos produtos são fornecidas pelos fabricantes e podem sofrer atualizações.
            </p>
          </section>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-2">
              Para dúvidas sobre nossos termos, entre em contato pelo e-mail: <a href="mailto:suporte@lidermaq.com.br" className="text-accent hover:underline">suporte@lidermaq.com.br</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
