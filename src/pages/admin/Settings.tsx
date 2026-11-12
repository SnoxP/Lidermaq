import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save, 
  Moon, 
  Sun, 
  Monitor, 
  ChevronRight,
  Search,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  Server,
  FileCode,
  MapPin
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [siteName, setSiteName] = useState('Lidermaq Equipamentos');
  const [contactEmail, setContactEmail] = useState('contato@lidermaq.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [activeTab, setActiveTab] = useState<'geral' | 'seo' | 'aparencia' | 'notificacoes' | 'seguranca'>('geral');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-3kkzkpl4snegbmdmslezc2-60270630702.us-west1.run.app';

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteName(data.siteName || 'Lidermaq Equipamentos');
          setContactEmail(data.contactEmail || 'contato@lidermaq.com');
          setMaintenanceMode(data.maintenanceMode || false);
          setAllowIndexing(data.allowIndexing !== false);
        } else {
          // Fallback para api local se doc ainda não foi criado
          const res = await fetch('/api/indexing-status');
          if (res.ok) {
            const json = await res.json();
            setAllowIndexing(json.allowIndexing !== false);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMessage(null);
    try {
      // 1. Salva no Firestore
      await setDoc(doc(db, 'settings', 'general'), {
        siteName,
        contactEmail,
        maintenanceMode,
        allowIndexing,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Sincroniza diretamente com o servidor Express (para robots.txt e cabeçalho X-Robots-Tag imediato)
      await fetch('/api/indexing-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowIndexing })
      }).catch(() => {});

      setSaveSuccessMessage('Configurações salvas e aplicadas com sucesso!');
      setTimeout(() => setSaveSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/admin" className="hover:text-accent transition-colors">Painel Administrativo</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Configurações</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter dark:text-white">CONFIGURAÇÕES DO SISTEMA</h1>
            <p className="text-primary/60 dark:text-zinc-400">Gerencie a visibilidade no Google, informações do site e segurança.</p>
          </div>

          {/* Quick status badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
              allowIndexing 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            }`}>
              {allowIndexing ? <Eye size={14} /> : <EyeOff size={14} />}
              {allowIndexing ? 'Indexação no Google: Ativa' : 'Google Bloqueado (noindex)'}
            </span>
          </div>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {saveSuccessMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 font-semibold text-sm">
                <Check size={18} className="text-emerald-600 dark:text-emerald-400" />
                {saveSuccessMessage}
              </div>
              <button onClick={() => setSaveSuccessMessage(null)} className="text-xs font-bold underline opacity-80 hover:opacity-100">
                Fechar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="space-y-2 lg:col-span-1">
            <button 
              onClick={() => setActiveTab('geral')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'geral' ? 'bg-accent text-white shadow-md' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300 bg-white/40 dark:bg-zinc-900/40'}`}
            >
              <Globe size={18} /> Geral
            </button>
            
            <button 
              onClick={() => setActiveTab('seo')}
              className={`w-full p-4 rounded-2xl flex items-center justify-between font-bold transition-all ${activeTab === 'seo' ? 'bg-accent text-white shadow-md' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300 bg-white/40 dark:bg-zinc-900/40'}`}
            >
              <div className="flex items-center gap-3">
                <Search size={18} /> Google & SEO
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${allowIndexing ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            </button>

            <button 
              onClick={() => setActiveTab('aparencia')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'aparencia' ? 'bg-accent text-white shadow-md' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300 bg-white/40 dark:bg-zinc-900/40'}`}
            >
              <Palette size={18} /> Aparência
            </button>

            <button 
              onClick={() => setActiveTab('notificacoes')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'notificacoes' ? 'bg-accent text-white shadow-md' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300 bg-white/40 dark:bg-zinc-900/40'}`}
            >
              <Bell size={18} /> Notificações
            </button>

            <button 
              onClick={() => setActiveTab('seguranca')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'seguranca' ? 'bg-accent text-white shadow-md' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300 bg-white/40 dark:bg-zinc-900/40'}`}
            >
              <Shield size={18} /> Segurança
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl shadow-sm h-64 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <p className="text-xs text-zinc-500">Carregando configurações...</p>
              </div>
            ) : (
              <>
                {/* ABA GERAL */}
                {activeTab === 'geral' && (
                  <>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6 transition-colors">
                      <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Informações Básicas</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2">Nome do Site</label>
                          <input 
                            type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)}
                            className="w-full px-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2">E-mail de Contato</label>
                          <input 
                            type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6 transition-colors">
                      <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Sistema & Visibilidade</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold dark:text-white">Modo de Manutenção</p>
                          <p className="text-xs text-primary/60 dark:text-zinc-400">Oculta o site para visitantes externos.</p>
                        </div>
                        <button 
                          onClick={() => setMaintenanceMode(!maintenanceMode)}
                          className={`w-14 h-8 rounded-full transition-all relative ${maintenanceMode ? 'bg-accent' : 'bg-neutral-bg dark:bg-zinc-700'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${maintenanceMode ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="pt-4 border-t border-neutral-bg dark:border-white/10 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold dark:text-white">Indexação no Google (SEO)</p>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${allowIndexing ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
                              {allowIndexing ? 'Ativo' : 'Bloqueado'}
                            </span>
                          </div>
                          <p className="text-xs text-primary/60 dark:text-zinc-400">Configuração completa e remoção rápida na aba "Google & SEO".</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('seo')}
                          className="px-3 py-1.5 text-xs font-bold text-accent hover:underline flex items-center gap-1"
                        >
                          Ver detalhes <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ABA DEDICADA: GOOGLE & SEO */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    {/* Status Card */}
                    <div className={`p-6 rounded-3xl border transition-all ${
                      allowIndexing 
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60' 
                        : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-2xl ${
                            allowIndexing ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                          }`}>
                            {allowIndexing ? <Eye size={24} /> : <EyeOff size={24} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black dark:text-white font-display">
                                {allowIndexing ? 'SITE VISÍVEL NO GOOGLE (INDEXAÇÃO ATIVA)' : 'SITE BLOQUEADO / NOINDEX ATIVO'}
                              </h3>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
                              {allowIndexing 
                                ? 'Os buscadores como o Google têm autorização para ler o catálogo e exibir a Lidermaq nos resultados de pesquisa.' 
                                : 'Todas as páginas agora informam aos buscadores para remover o site do Google imediatamente (via noindex, nofollow, e bloqueio de robôs).'}
                            </p>
                          </div>
                        </div>

                        {/* Switch Toggle */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {allowIndexing ? 'Permitido' : 'Bloqueado'}
                          </span>
                          <button 
                            type="button"
                            onClick={() => setAllowIndexing(!allowIndexing)}
                            className={`w-16 h-9 rounded-full transition-all relative p-1 shadow-inner ${
                              allowIndexing ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            title="Alternar permissão de indexação no Google"
                          >
                            <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-all ${
                              allowIndexing ? 'translate-x-7' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Defesas Técnicas Aplicadas */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-200/70 dark:border-white/5 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Camadas de Controle Ativas em Tempo Real
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                          <div className="flex items-center gap-2 text-xs font-bold dark:text-white mb-1">
                            <Server size={14} className="text-accent" /> Cabeçalho de Servidor
                          </div>
                          <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 break-all">
                            {allowIndexing ? 'X-Robots-Tag: index' : 'X-Robots-Tag: noindex, nofollow'}
                          </p>
                          <span className="text-[10px] text-zinc-400 mt-1 block">Lido antes do HTML pelo Googlebot</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                          <div className="flex items-center gap-2 text-xs font-bold dark:text-white mb-1">
                            <FileCode size={14} className="text-accent" /> Arquivo robots.txt
                          </div>
                          <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                            {allowIndexing ? 'Disallow: (nenhum)' : 'Disallow: / (bloqueia tudo)'}
                          </p>
                          <a 
                            href="/robots.txt" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-accent hover:underline mt-1 inline-flex items-center gap-0.5"
                          >
                            Ver /robots.txt ao vivo <ExternalLink size={10} />
                          </a>
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                          <div className="flex items-center gap-2 text-xs font-bold dark:text-white mb-1">
                            <Globe size={14} className="text-accent" /> Meta Tags no HTML
                          </div>
                          <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                            {allowIndexing ? '<meta name="robots" content="index">' : '<meta name="robots" content="noindex">'}
                          </p>
                          <span className="text-[10px] text-zinc-400 mt-1 block">Injetado em todas as páginas</span>
                        </div>
                      </div>
                    </div>

                    {/* Acelerador de Remoção: Google Search Console */}
                    <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-500/30 dark:border-amber-500/20 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500 text-white">
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-black dark:text-white font-display">
                            Acelerador de Remoção do Google (Urgência: 2 a 4 Horas)
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            O robô do Google pode levar dias para visitar o site e perceber que ele está em "noindex". Se você quer tirar a Lidermaq das pesquisas <strong>hoje mesmo</strong>, siga este passo a passo oficial:
                          </p>
                        </div>
                      </div>

                      {/* URL Box com botão de copiar */}
                      <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-800 dark:text-zinc-200 truncate w-full sm:w-auto">
                          <span className="text-zinc-400">URL para remover:</span>
                          <span className="font-bold">{siteUrl}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUrl}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-accent hover:text-white text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0"
                        >
                          {copiedUrl ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          {copiedUrl ? 'URL Copiada!' : 'Copiar URL do Site'}
                        </button>
                      </div>

                      {/* 3 Passos Simples */}
                      <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                          <span>Clique no botão abaixo para abrir a <strong>Ferramenta de Remoções do Google Search Console</strong>.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                          <span>Clique em <strong>"Nova solicitação"</strong> e selecione a opção <strong>"Remover todos os URLs com este prefixo"</strong>.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                          <span>Cole a URL copiada e confirme. O Google oculta os resultados das buscas em poucas horas enquanto o <code>noindex</code> conclui a exclusão permanente.</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <a
                          href="https://search.google.com/search-console/removals"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all w-full sm:w-auto"
                        >
                          <ExternalLink size={15} /> Abrir Ferramenta de Remoções do Google Search Console
                        </a>
                      </div>
                    </div>

                    {/* Google Meu Negócio (Ficha do Maps) */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-200/70 dark:border-white/5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold dark:text-white">Deseja remover a ficha física do Google Maps?</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Aquele painel com telefone, endereço físico e fotos no Google Maps é controlado pelo Perfil da Empresa (Google Meu Negócio).
                          </p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <a
                          href="https://business.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Acessar Gerenciador de Perfis de Empresas do Google <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA APARÊNCIA */}
                {activeTab === 'aparencia' && (
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6 transition-colors">
                    <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Tema do Site</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${theme === 'light' ? 'border-accent bg-accent/5' : 'border-transparent bg-neutral-bg dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                      >
                        <Sun size={24} className={theme === 'light' ? 'text-accent' : 'text-zinc-500'} />
                        <span className={`font-bold text-sm ${theme === 'light' ? 'text-accent' : 'text-zinc-500'}`}>Claro</span>
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${theme === 'dark' ? 'border-accent bg-accent/5' : 'border-transparent bg-neutral-bg dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                      >
                        <Moon size={24} className={theme === 'dark' ? 'text-accent' : 'text-zinc-500'} />
                        <span className={`font-bold text-sm ${theme === 'dark' ? 'text-accent' : 'text-zinc-500'}`}>Escuro</span>
                      </button>
                      <button 
                        onClick={() => setTheme('system')}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${theme === 'system' ? 'border-accent bg-accent/5' : 'border-transparent bg-neutral-bg dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                      >
                        <Monitor size={24} className={theme === 'system' ? 'text-accent' : 'text-zinc-500'} />
                        <span className={`font-bold text-sm ${theme === 'system' ? 'text-accent' : 'text-zinc-500'}`}>Sistema</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ABA NOTIFICAÇÕES */}
                {activeTab === 'notificacoes' && (
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6 transition-colors">
                     <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Preferências de Notificação</h3>
                     <p className="text-zinc-500 dark:text-zinc-400 text-sm">Configurações de notificação em breve.</p>
                  </div>
                )}

                {/* ABA SEGURANÇA */}
                {activeTab === 'seguranca' && (
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6 transition-colors">
                     <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Segurança da Conta</h3>
                     <p className="text-zinc-500 dark:text-zinc-400 text-sm">Configurações de segurança em breve.</p>
                  </div>
                )}

                {/* Botão de Salvar Global */}
                <div className="pt-2">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full btn-primary py-4 flex justify-center items-center gap-2 disabled:opacity-50 text-base shadow-lg"
                  >
                    {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />} 
                    {isSaving ? 'Salvando Configurações...' : 'Salvar Alterações'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
