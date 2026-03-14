import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, ShieldCheck, Mail, ChevronRight, Search } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, setDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<{id: string}[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredAdmins = admins.filter(admin => 
    admin.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/admin" className="hover:text-accent transition-colors">Painel Administrativo</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Gerenciar Administradores</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Gerenciar Administradores</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Adicione ou remova permissões de administrador para usuários.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Admin Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-accent" />
                Novo Administrador
              </h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">E-mail do Usuário</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="email" 
                      required 
                      value={newAdminEmail} 
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-zinc-900 dark:text-white"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus size={18} /> {isLoading ? 'Adicionando...' : 'Adicionar Admin'}
                </button>
              </form>
            </div>
          </div>

          {/* Admin List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Users size={20} className="text-zinc-400" />
                  Administradores Atuais
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar e-mail..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-zinc-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {/* Master Admin */}
                <div className="p-4 flex items-center justify-between bg-accent/5 dark:bg-accent/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-white block">pedronobreneto27@gmail.com</span>
                      <span className="text-xs text-accent font-medium uppercase tracking-wider">Admin Mestre</span>
                    </div>
                  </div>
                </div>

                {/* Other Admins */}
                {filteredAdmins.filter(a => a.id !== "pedronobreneto27@gmail.com").map(admin => (
                  <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        <Users size={20} />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white">{admin.id}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remover administrador"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {filteredAdmins.length <= 1 && (
                  <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                    Nenhum administrador adicional cadastrado.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
