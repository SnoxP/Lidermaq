import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

export const Profile = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        // O AuthContext atualizará automaticamente via onAuthStateChanged
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-12 text-center">
          <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">MEU PERFIL</h1>
          <p className="text-primary/60">Gerencie suas informações pessoais.</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2 ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2 ml-1">E-mail (Não alterável)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
                <input 
                  type="email" disabled value={user?.email || ''}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-bg rounded-xl opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-4 bg-accent/5 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Nível de Acesso</p>
                <p className="text-xs text-primary/60">{user?.isAdmin ? 'Administrador do Sistema' : 'Usuário Comum'}</p>
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full btn-primary py-4 flex justify-center items-center gap-2"
            >
              <Save size={20} /> {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>

          <div className="pt-6 border-t border-neutral-bg">
            <button 
              onClick={logout}
              className="w-full py-4 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              <LogOut size={20} /> Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
