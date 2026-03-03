import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Privacy = () => {
  return (
    <div className="pt-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO 
        title="Política de Privacidade"
        description="Conheça como a Lidermaq protege seus dados e garante sua privacidade."
      />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/90 to-zinc-900 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" 
            alt="Privacidade" 
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
                Transparência e Segurança
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white font-display">
                POLÍTICA DE <span className="text-accent">PRIVACIDADE</span>
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                Na Lidermaq, a sua privacidade é uma prioridade. Conheça como tratamos seus dados com total segurança e transparência.
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
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Compromisso com a Segurança</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              A Lidermaq Equipamentos, sediada em Picos-PI, compromete-se a proteger a privacidade e a segurança dos dados de seus clientes e usuários do site. Esta política descreve como coletamos, usamos e protegemos as informações que você nos fornece.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Coleta de Informações</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              Coletamos informações quando você interage conosco, seja através do nosso formulário de contato, solicitações de orçamento via WhatsApp ou ao navegar em nosso catálogo. Os dados coletados podem incluir:
            </p>
            <ul className="list-disc list-inside text-primary/70 dark:text-zinc-400 space-y-2 ml-4">
              <li>Nome completo ou Razão Social</li>
              <li>E-mail e número de telefone/WhatsApp</li>
              <li>Informações sobre o equipamento de interesse</li>
              <li>Dados de navegação (cookies) para melhorar sua experiência</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Uso dos Dados</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              Seus dados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-primary/70 dark:text-zinc-400 space-y-2 ml-4">
              <li>Processar e responder suas solicitações de orçamento</li>
              <li>Fornecer suporte técnico especializado</li>
              <li>Enviar novidades e ofertas (apenas se você autorizar via newsletter)</li>
              <li>Melhorar a usabilidade e funcionalidade do nosso site</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Proteção e Compartilhamento</h2>
            </div>
            <p className="text-primary/70 dark:text-zinc-400 leading-relaxed mb-4">
              Não vendemos, trocamos ou transferimos suas informações para terceiros sem o seu consentimento, exceto quando necessário para cumprir obrigações legais ou para prestadores de serviços que nos auxiliam na operação do negócio (como serviços de entrega), desde que estes concordem em manter as informações confidenciais.
            </p>
          </section>

          <div className="pt-8 border-t border-neutral-bg dark:border-white/5 text-center">
            <p className="text-primary/40 dark:text-zinc-500 text-sm">
              Última atualização: Fevereiro de 2026. <br />
              Para dúvidas sobre nossa política, entre em contato pelo e-mail: suporte@lidermaq.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
