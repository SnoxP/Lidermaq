import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { SEO } from '../components/SEO';

export const PrivacyPolicy = () => {
  return (
    <div className="pt-32 pb-20">
      <SEO 
        title="Política de Privacidade"
        description="Conheça como a Lidermaq protege seus dados e garante sua privacidade."
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black tracking-tighter mb-6">POLÍTICA DE PRIVACIDADE</h1>
          <p className="text-xl text-primary/60 leading-relaxed">
            Na Lidermaq, a sua privacidade é uma prioridade. Conheça como tratamos seus dados.
          </p>
        </motion.div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">Compromisso com a Segurança</h2>
            </div>
            <p className="text-primary/70 leading-relaxed mb-4">
              A Lidermaq Equipamentos, sediada em Picos-PI, compromete-se a proteger a privacidade e a segurança dos dados de seus clientes e usuários do site. Esta política descreve como coletamos, usamos e protegemos as informações que você nos fornece.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold">Coleta de Informações</h2>
            </div>
            <p className="text-primary/70 leading-relaxed mb-4">
              Coletamos informações quando você interage conosco, seja através do nosso formulário de contato, solicitações de orçamento via WhatsApp ou ao navegar em nosso catálogo. Os dados coletados podem incluir:
            </p>
            <ul className="list-disc list-inside text-primary/70 space-y-2 ml-4">
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
              <h2 className="text-2xl font-bold">Uso dos Dados</h2>
            </div>
            <p className="text-primary/70 leading-relaxed mb-4">
              Seus dados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-primary/70 space-y-2 ml-4">
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
              <h2 className="text-2xl font-bold">Proteção e Compartilhamento</h2>
            </div>
            <p className="text-primary/70 leading-relaxed mb-4">
              Não vendemos, trocamos ou transferimos suas informações para terceiros sem o seu consentimento, exceto quando necessário para cumprir obrigações legais ou para prestadores de serviços que nos auxiliam na operação do negócio (como serviços de entrega), desde que estes concordem em manter as informações confidenciais.
            </p>
          </section>

          <div className="pt-8 border-t border-neutral-bg text-center">
            <p className="text-primary/40 text-sm">
              Última atualização: Fevereiro de 2026. <br />
              Para dúvidas sobre nossa política, entre em contato pelo e-mail: suporte@lidermaq.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
