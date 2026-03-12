import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Save, Shield, LogOut, Camera, MapPin, Calendar, Hash, Clock, Package, DollarSign, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const Profile = () => {
  const { user, logout, deleteAccount } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [cep, setCep] = useState(user?.cep || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMGBB_API_KEY || IMGBB_API_KEY === "sua_chave_aqui") {
      alert("Chave de API do ImgBB não configurada.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setPhotoURL(data.data.url);
      } else {
        throw new Error(data.error?.message || "Erro no upload");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      if (auth.currentUser && user?.id) {
        await updateProfile(auth.currentUser, { displayName: name, photoURL });
        
        await updateDoc(doc(db, 'users', user.id), {
          name,
          cep,
          birthDate,
          photoURL
        });

        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        // O AuthContext atualizará automaticamente via onAuthStateChanged
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('pt-BR');
    }
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount();
      // O AuthContext vai deslogar e a ProtectedRoute vai redirecionar para home/login
    } catch (error: any) {
      setDeleteError(error.message || 'Erro ao excluir conta. Tente novamente.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6 group">
            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl">
              {photoURL ? (
                <img src={photoURL} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <User size={48} />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-black tracking-tighter dark:text-white">{name || 'Usuário'}</h1>
            {user?.tag && (
              <span className="px-3 py-1 bg-accent/10 text-accent font-bold rounded-full text-sm">
                {user.tag}
              </span>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">Gerencie suas informações pessoais e acompanhe seu histórico.</p>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
            message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Estatísticas */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-200 dark:border-white/5">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Hash size={20} className="text-accent" />
                Resumo da Conta
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                    <Clock size={14} /> Membro desde
                  </p>
                  <p className="font-medium dark:text-white">{formatDate(user?.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                    <Package size={14} /> Total de Pedidos
                  </p>
                  <p className="font-medium dark:text-white">{user?.totalOrders || 0} pedidos</p>
                </div>
                
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                    <DollarSign size={14} /> Valor Gasto
                  </p>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">
                    R$ {(user?.totalSpent || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">Nível de Acesso</p>
                  <p className="text-xs text-zinc-500">{user?.isAdmin ? 'Administrador do Sistema' : 'Usuário Comum'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-white/5">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6 text-xl">Dados Pessoais</h3>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input 
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border border-transparent dark:border-white/5"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">E-mail (Não alterável)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input 
                      type="email" disabled value={user?.email || ''}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl opacity-50 cursor-not-allowed border border-transparent dark:border-white/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">CEP</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input 
                      type="text" value={cep} onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border border-transparent dark:border-white/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Data de Nascimento</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input 
                      type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border border-transparent dark:border-white/5"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" disabled={isLoading}
                  className="flex-1 btn-primary py-4 flex justify-center items-center gap-2"
                >
                  <Save size={20} /> {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                
                <button 
                  type="button" onClick={logout}
                  className="px-8 py-4 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors flex justify-center items-center gap-2 border border-transparent"
                >
                  <LogOut size={20} /> Sair
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-red-100 dark:border-red-900/30">
              <h4 className="text-red-600 dark:text-red-500 font-bold mb-2 flex items-center gap-2">
                <AlertTriangle size={20} /> Zona de Perigo
              </h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Ao excluir sua conta, todos os seus dados pessoais, histórico de pedidos e informações salvas serão permanentemente apagados. Esta ação não pode ser desfeita.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 text-red-600 font-bold bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors flex items-center gap-2 border border-transparent dark:border-red-500/20"
              >
                <Trash2 size={18} /> Excluir Minha Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-white/10"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-center mb-2 dark:text-white">Excluir Conta?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-center mb-6">
                Você tem certeza que deseja excluir sua conta permanentemente? Todos os seus dados serão perdidos.
              </p>

              {deleteError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium text-center">
                  {deleteError}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                  {isDeleting ? 'Excluindo...' : 'Sim, excluir minha conta'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError('');
                  }}
                  disabled={isDeleting}
                  className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
