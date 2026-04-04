import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save, Moon, Sun, Monitor, ChevronRight } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('geral');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        siteName,
        contactEmail,
        maintenanceMode,
        allowIndexing
      }, { merge: true });
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/admin" className="hover:text-accent transition-colors">Painel Administrativo</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Configurações</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter dark:text-white">CONFIGURAÇÕES DO SITE</h1>
          <p className="text-primary/60 dark:text-zinc-400">Ajustes globais e preferências do sistema.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('geral')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'geral' ? 'bg-accent text-white' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300'}`}
            >
              <Globe size={20} /> Geral
            </button>
            <button 
              onClick={() => setActiveTab('aparencia')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'aparencia' ? 'bg-accent text-white' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300'}`}
            >
              <Palette size={20} /> Aparência
            </button>
            <button 
              onClick={() => setActiveTab('notificacoes')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'notificacoes' ? 'bg-accent text-white' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300'}`}
            >
              <Bell size={20} /> Notificações
            </button>
            <button 
              onClick={() => setActiveTab('seguranca')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'seguranca' ? 'bg-accent text-white' : 'hover:bg-white dark:hover:bg-zinc-900 dark:text-zinc-300'}`}
            >
              <Shield size={20} /> Segurança
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {isLoading ? (
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : (
              <>
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
                      <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Sistema</h3>
                      
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

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-bg dark:border-white/10">
                        <div>
                          <p className="font-bold dark:text-white">Indexação no Google (SEO)</p>
                          <p className="text-xs text-primary/60 dark:text-zinc-400">Permite que o site apareça nos resultados de busca do Google.</p>
                        </div>
                        <button 
                          onClick={() => setAllowIndexing(!allowIndexing)}
                          className={`w-14 h-8 rounded-full transition-all relative ${allowIndexing ? 'bg-accent' : 'bg-neutral-bg dark:bg-zinc-700'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${allowIndexing ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

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

                {activeTab === 'notificacoes' && (
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6 transition-colors">
                     <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Preferências de Notificação</h3>
                     <p className="text-zinc-500 dark:text-zinc-400 text-sm">Configurações de notificação em breve.</p>
                  </div>
                )}

                {activeTab === 'seguranca' && (
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6 transition-colors">
                     <h3 className="text-xl font-bold border-b border-neutral-bg dark:border-white/10 pb-4 dark:text-white">Segurança da Conta</h3>
                     <p className="text-zinc-500 dark:text-zinc-400 text-sm">Configurações de segurança em breve.</p>
                  </div>
                )}

                <button 
                  onClick={handleSave}
                  disabled={isSaving || activeTab !== 'geral'}
                  className="w-full btn-primary py-4 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} /> {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
