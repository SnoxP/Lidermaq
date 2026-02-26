import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Eye, EyeOff, Shield, Search, X, Clock, Circle } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('lastSeen', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar usuários:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const togglePassword = (userId: string) => {
    setShowPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatLastSeen = (timestamp: any) => {
    if (!timestamp) return 'Nunca';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">USUÁRIOS REGISTRADOS</h1>
            <p className="text-primary/60">Visualize quem está cadastrado e ativo no site.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
              <input 
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 shadow-sm"
                placeholder="Buscar por nome ou e-mail..."
              />
            </div>
            <button onClick={() => navigate('/admin')} className="p-4 bg-white rounded-xl hover:bg-neutral-bg transition-colors shadow-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mb-8 flex items-start gap-4">
          <Shield className="text-amber-500 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-amber-800 mb-1">Nota de Segurança sobre Senhas</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              Por questões de segurança e privacidade, o Firebase criptografa todas as senhas. 
              <strong> Não é possível visualizar a senha real de nenhum usuário</strong>, nem mesmo como administrador. 
              Abaixo, mostramos apenas um indicador simbólico.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-bg/50 text-xs font-bold uppercase tracking-widest text-primary/40">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Nome de Usuário</th>
                  <th className="px-6 py-4">E-mail (Gmail)</th>
                  <th className="px-6 py-4">Senha</th>
                  <th className="px-6 py-4">Último Acesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-bg">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-primary/40 animate-pulse">Carregando usuários...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-primary/40 italic">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-bg/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Circle size={10} className={u.isOnline ? "fill-emerald-500 text-emerald-500" : "fill-neutral-300 text-neutral-300"} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {u.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-xs">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary/60">{u.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm tracking-widest">
                            {showPasswords[u.id] ? '********' : '••••••••'}
                          </span>
                          <button 
                            onClick={() => togglePassword(u.id)}
                            className="p-2 hover:bg-neutral-bg rounded-lg transition-colors text-primary/40"
                          >
                            {showPasswords[u.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary/40">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {formatLastSeen(u.lastSeen)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
