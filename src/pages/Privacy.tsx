import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export const Privacy = () => {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO 
        title="Política de Privacidade - Lidermaq"
        description="Conheça como a Lidermaq protege seus dados e garante sua privacidade."
      />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Política de Privacidade</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 dark:text-white font-display">
            POLÍTICA DE <span className="text-accent">PRIVACIDADE</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Na Lidermaq, a sua privacidade é uma prioridade. Conheça como tratamos seus dados com total segurança e transparência.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">Compromisso com a Segurança</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A Lidermaq Equipamentos, sediada em Picos-PI, compromete-se a proteger a privacidade e a segurança dos dados de seus clientes e usuários do site. Esta política descreve como coletamos, usamos e protegemos as informações que você nos fornece.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">Coleta de Informações</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Coletamos informações quando você interage conosco, seja através do nosso formulário de contato, solicitações de orçamento via WhatsApp ou ao navegar em nosso catálogo. Os dados coletados podem incluir:
            </p>
            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 ml-4">
              <li>Nome completo ou Razão Social</li>
              <li>E-mail e número de telefone/WhatsApp</li>
              <li>Informações sobre o equipamento de interesse</li>
              <li>Dados de navegação (cookies) para melhorar sua experiência</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">Uso dos Dados</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Seus dados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 ml-4">
              <li>Processar e responder suas solicitações de orçamento</li>
              <li>Fornecer suporte técnico especializado</li>
              <li>Enviar novidades e ofertas (apenas se você autorizar via newsletter)</li>
              <li>Melhorar a usabilidade e funcionalidade do nosso site</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-accent rounded-xl flex items-center justify-center shrink-0">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white font-display">Proteção e Compartilhamento</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              A Lidermaq <strong>não vende, aluga ou compartilha</strong> suas informações pessoais com terceiros para fins de marketing. Seus dados são armazenados em ambientes seguros e acessíveis apenas por funcionários autorizados.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Podemos compartilhar informações apenas quando exigido por lei ou para proteger nossos direitos legais.
            </p>
          </section>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-2">
              Dúvidas sobre nossa política? Entre em contato via <a href="mailto:contato@lidermaq.com.br" className="text-accent hover:underline">contato@lidermaq.com.br</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
