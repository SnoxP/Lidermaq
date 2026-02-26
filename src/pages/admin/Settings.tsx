import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

export const Settings = () => {
  const [siteName, setSiteName] = useState('Lidermaq Equipamentos');
  const [contactEmail, setContactEmail] = useState('contato@lidermaq.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter">CONFIGURAÇÕES DO SITE</h1>
          <p className="text-primary/60">Ajustes globais e preferências do sistema.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <button className="w-full p-4 bg-accent text-white rounded-2xl flex items-center gap-3 font-bold">
              <Globe size={20} /> Geral
            </button>
            <button className="w-full p-4 hover:bg-white rounded-2xl flex items-center gap-3 font-bold transition-all">
              <Palette size={20} /> Aparência
            </button>
            <button className="w-full p-4 hover:bg-white rounded-2xl flex items-center gap-3 font-bold transition-all">
              <Bell size={20} /> Notificações
            </button>
            <button className="w-full p-4 hover:bg-white rounded-2xl flex items-center gap-3 font-bold transition-all">
              <Shield size={20} /> Segurança
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="text-xl font-bold border-b border-neutral-bg pb-4">Informações Básicas</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2">Nome do Site</label>
                  <input 
                    type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2">E-mail de Contato</label>
                  <input 
                    type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="text-xl font-bold border-b border-neutral-bg pb-4">Sistema</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Modo de Manutenção</p>
                  <p className="text-xs text-primary/60">Oculta o site para visitantes externos.</p>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-14 h-8 rounded-full transition-all relative ${maintenanceMode ? 'bg-accent' : 'bg-neutral-bg'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${maintenanceMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <button className="w-full btn-primary py-4 flex justify-center items-center gap-2">
              <Save size={20} /> Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
