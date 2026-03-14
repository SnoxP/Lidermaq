import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Save, Shield, LogOut, Camera, MapPin, Calendar, Hash, Clock, Package, DollarSign, Loader2, Trash2, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

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
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      setDeleteError(error.message || "Erro ao excluir conta. Tente novamente.");
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO title="Meu Perfil - Lidermaq" />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Minha Conta</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-lg">
                  {photoURL || user.photoURL ? (
                    <img 
                      src={photoURL || user.photoURL} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <User size={40} />
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <h2 className="font-bold text-lg dark:text-white truncate">{user.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
              
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <Shield size={12} />
                  {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-accent/10 text-accent">
                  <User size={18} />
                  Dados Pessoais
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <Package size={18} />
                  Meus Pedidos
                </button>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-4"
                >
                  <LogOut size={18} />
                  Sair da Conta
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-2xl font-black mb-6 dark:text-white font-display">DADOS PESSOAIS</h2>
              
              {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                    : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <User size={16} className="text-zinc-400" />
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Mail size={16} className="text-zinc-400" />
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-zinc-500 mt-1">O e-mail não pode ser alterado.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <MapPin size={16} className="text-zinc-400" />
                      CEP
                    </label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Calendar size={16} className="text-zinc-400" />
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>

            {/* Account Details Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Informações da Conta</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                  <Hash size={16} className="text-zinc-400" />
                  <div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">ID do Usuário</p>
                    <p className="font-mono text-zinc-900 dark:text-white truncate">{user.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                  <Clock size={16} className="text-zinc-400" />
                  <div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">Membro desde</p>
                    <p className="text-zinc-900 dark:text-white">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-500/5 rounded-2xl p-6 border border-red-100 dark:border-red-500/10">
              <h3 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle size={20} />
                Zona de Perigo
              </h3>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2.5 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Excluir Minha Conta
                </button>
              ) : (
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-red-200 dark:border-red-500/20">
                  <p className="font-bold text-zinc-900 dark:text-white mb-4">Tem certeza absoluta?</p>
                  {deleteError && (
                    <p className="text-sm text-red-500 mb-4">{deleteError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      Sim, excluir conta
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteError('');
                      }}
                      disabled={isDeleting}
                      className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
