import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, ShieldCheck, Mail, X } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, setDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<{id: string}[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    const querySnapshot = await getDocs(collection(db, 'admins'));
    const adminList = querySnapshot.docs.map(doc => ({ id: doc.id }));
    setAdmins(adminList);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setIsLoading(true);
    try {
      // Usamos o email como o ID do documento para facilitar a busca
      await setDoc(doc(db, 'admins', newAdminEmail.trim().toLowerCase()), {
        addedAt: new Date().toISOString()
      });
      setNewAdminEmail('');
      fetchAdmins();
    } catch (error) {
      console.error("Erro ao adicionar admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (email === "pedronobreneto27@gmail.com") {
      alert("O administrador mestre não pode ser removido.");
      return;
    }
    if (!confirm(`Tem certeza que deseja remover ${email} como administrador?`)) return;
    
    try {
      await deleteDoc(doc(db, 'admins', email));
      fetchAdmins();
    } catch (error) {
      console.error("Erro ao remover admin:", error);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">GERENCIAR ADMINISTRADORES</h1>
            <p className="text-primary/60">Adicione outros usuários para gerenciar o site.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="p-3 hover:bg-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mb-8">
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2 ml-1">E-mail do Novo Admin</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
                <input 
                  type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="exemplo@gmail.com"
                />
              </div>
              <button 
                type="submit" disabled={isLoading}
                className="btn-primary px-8 flex items-center gap-2"
              >
                <Plus size={20} /> {isLoading ? '...' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-bg flex items-center gap-2">
            <ShieldCheck className="text-accent" />
            <h3 className="font-bold">Administradores Atuais</h3>
          </div>
          <div className="divide-y divide-neutral-bg">
            <div className="p-6 flex items-center justify-between bg-accent/5">
              <div>
                <span className="font-bold">pedronobreneto27@gmail.com</span>
                <span className="ml-2 text-[10px] bg-accent text-white px-2 py-1 rounded-full uppercase font-black">Mestre</span>
              </div>
              <div className="p-3 opacity-20"><Trash2 size={20} /></div>
            </div>
            {admins.filter(a => a.id !== "pedronobreneto27@gmail.com").map((admin) => (
              <div key={admin.id} className="p-6 flex items-center justify-between hover:bg-neutral-bg/50 transition-colors">
                <span className="font-bold">{admin.id}</span>
                <button 
                  onClick={() => handleRemoveAdmin(admin.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {admins.length <= 1 && (
              <div className="p-8 text-center text-primary/40 italic text-sm">Nenhum administrador adicional cadastrado.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
