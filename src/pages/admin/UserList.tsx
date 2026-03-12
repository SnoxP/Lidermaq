import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Eye, EyeOff, Shield, Search, X, Clock, Circle, ShieldAlert, ShieldCheck, Trash2, Ban } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, orderBy, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const UserList = () => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [bannedIps, setBannedIps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'banned'>('active');
  const [admins, setAdmins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'users'), orderBy('lastSeen', 'desc'));
    
    const unsubscribeUsers = onSnapshot(q, (querySnapshot) => {
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllUsers(userList);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar usuários:", error);
      setIsLoading(false);
    });

    const unsubscribeAdmins = onSnapshot(collection(db, 'admins'), (snapshot) => {
      const adminEmails = snapshot.docs.map(doc => doc.id.toLowerCase());
      setAdmins(adminEmails);
    });

    const unsubscribeBannedIps = onSnapshot(collection(db, 'banned_ips'), (snapshot) => {
      const ips = snapshot.docs.map(doc => doc.data().ip);
      setBannedIps(ips);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAdmins();
      unsubscribeBannedIps();
    };
  }, []);

  const toggleAdmin = async (email: string) => {
    if (!email) return;
    const lowerEmail = email.toLowerCase();
    if (lowerEmail === "pedronobreneto27@gmail.com") {
      alert("O administrador mestre não pode ser alterado.");
      return;
    }

    const isAdmin = admins.includes(lowerEmail);
    const confirmMsg = isAdmin 
      ? `Remover privilégios de administrador de ${email}?` 
      : `Tornar ${email} um administrador?`;

    if (!confirm(confirmMsg)) return;

    try {
      if (isAdmin) {
        await deleteDoc(doc(db, 'admins', lowerEmail));
      } else {
        await setDoc(doc(db, 'admins', lowerEmail), {
          addedAt: new Date().toISOString(),
          promotedFromList: true
        });
      }
    } catch (error) {
      console.error("Erro ao alterar privilégios:", error);
      alert("Erro ao alterar privilégios. Verifique as regras do Firestore.");
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (email?.toLowerCase() === "pedronobreneto27@gmail.com") {
      alert("O administrador mestre não pode ser removido.");
      return;
    }

    if (!confirm(`Tem certeza que deseja remover o usuário ${email} do banco de dados e da autenticação? Esta ação não pode ser desfeita.`)) return;

    try {
      // Remove do Firebase Auth via backend
      const response = await fetch(`/api/delete-user/${userId}`, { method: 'DELETE' });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Erro ao deletar do Auth");
      }

      // Remove do cadastro de usuários no Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      // Se for admin, remove também da lista de admins
      if (admins.includes(email.toLowerCase())) {
        await deleteDoc(doc(db, 'admins', email.toLowerCase()));
      }
      
      alert("Usuário removido com sucesso.");
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      alert("Erro ao remover usuário. Verifique as permissões.");
    }
  };

  const banUser = async (userId: string, email: string) => {
    if (email?.toLowerCase() === "pedronobreneto27@gmail.com") {
      alert("O administrador mestre não pode ser banido.");
      return;
    }

    if (!confirm(`Tem certeza que deseja banir o usuário ${email}?`)) return;

    try {
      await setDoc(doc(db, 'users', userId), { isBanned: true }, { merge: true });
      alert("Usuário banido com sucesso.");
    } catch (error) {
      console.error("Erro ao banir usuário:", error);
      alert("Erro ao banir usuário.");
    }
  };

  const unbanUser = async (userId: string, email: string, ip?: string) => {
    if (!confirm(`Tem certeza que deseja desbanir o usuário ${email}?`)) return;

    try {
      await setDoc(doc(db, 'users', userId), { isBanned: false }, { merge: true });
      if (ip && bannedIps.includes(ip)) {
        await deleteDoc(doc(db, 'banned_ips', ip.replace(/\./g, '_')));
      }
      alert("Usuário desbanido com sucesso.");
    } catch (error) {
      console.error("Erro ao desbanir usuário:", error);
      alert("Erro ao desbanir usuário.");
    }
  };

  const banIp = async (ip: string, email: string) => {
    if (!ip) {
      alert("IP não encontrado para este usuário.");
      return;
    }
    
    const isTargetAdmin = email?.toLowerCase() === "pedronobreneto27@gmail.com" || admins.includes(email?.toLowerCase());
    if (isTargetAdmin) {
      if (!confirm(`Atenção: Você está prestes a banir o IP de um administrador (${email}). Administradores são imunes a banimentos por IP, mas isso afetará outras contas usando o mesmo IP. Deseja continuar?`)) return;
    } else {
      if (!confirm(`Tem certeza que deseja banir o IP ${ip} (usado por ${email})? Isso banirá todas as contas usando este IP.`)) return;
    }

    try {
      await setDoc(doc(db, 'banned_ips', ip.replace(/\./g, '_')), {
        ip: ip,
        bannedAt: new Date().toISOString(),
        bannedEmail: email
      });
      alert("IP banido com sucesso.");
    } catch (error) {
      console.error("Erro ao banir IP:", error);
      alert("Erro ao banir IP.");
    }
  };

  const togglePassword = (userId: string) => {
    setShowPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const isUserBanned = (u: any) => {
    if (u.isBanned) return true;
    if (u.lastIp && bannedIps.includes(u.lastIp)) {
      const email = u.email?.toLowerCase();
      if (email === "pedronobreneto27@gmail.com" || admins.includes(email)) {
        return false; // Admins are not affected by IP bans
      }
      return true;
    }
    return false;
  };

  const activeUsers = allUsers.filter(u => !isUserBanned(u));
  const bannedUsers = allUsers.filter(u => isUserBanned(u));

  const filteredActiveUsers = activeUsers.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBannedUsers = bannedUsers.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUsers = activeTab === 'active' ? filteredActiveUsers : filteredBannedUsers;

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
    <div className="pt-32 pb-20 bg-neutral-bg dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter dark:text-white">GERENCIAR CONTAS</h1>
            <p className="text-primary/60 dark:text-zinc-400">Visualize e gerencie usuários cadastrados.</p>
          </div>
          <div className="flex gap-2 p-1 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'active' ? 'bg-accent text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              Ativos
            </button>
            <button 
              onClick={() => setActiveTab('banned')}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'banned' ? 'bg-red-500 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              Banidos
            </button>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 p-6 rounded-3xl mb-8 flex items-start gap-4">
          <Shield className="text-amber-500 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-500 mb-1">Sincronização de Usuários</h4>
            <p className="text-sm text-amber-700 dark:text-amber-600/80 leading-relaxed">
              Os usuários aparecem nesta lista automaticamente **após realizarem o primeiro login** no site. 
              Se você tem usuários no console do Firebase que não aparecem aqui, peça para que eles façam login uma vez para sincronizar os dados.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-bg/50 dark:bg-zinc-800/50 text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Nome de Usuário</th>
                  <th className="px-6 py-4">E-mail (Gmail)</th>
                  <th className="px-6 py-4">Acesso</th>
                  <th className="px-6 py-4">Último Acesso</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-bg dark:divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-primary/40 dark:text-zinc-500 animate-pulse">Carregando usuários...</td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-primary/40 dark:text-zinc-500 italic">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  currentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-bg/30 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Circle size={10} className={u.isOnline ? "fill-emerald-500 text-emerald-500" : "fill-neutral-300 dark:fill-zinc-700 text-neutral-300 dark:text-zinc-700"} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter dark:text-zinc-400">
                            {u.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-xs">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-sm dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary/60 dark:text-zinc-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleAdmin(u.email)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${
                            admins.includes(u.email?.toLowerCase())
                              ? 'bg-accent text-white'
                              : 'bg-neutral-bg dark:bg-zinc-800 text-primary/40 dark:text-zinc-500 hover:bg-accent/10 hover:text-accent'
                          }`}
                        >
                          {admins.includes(u.email?.toLowerCase()) ? (
                            <><ShieldCheck size={12} /> Admin</>
                          ) : (
                            <><ShieldAlert size={12} /> Tornar Admin</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary/40 dark:text-zinc-500">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {formatLastSeen(u.lastSeen)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right flex gap-2 justify-end">
                        {activeTab === 'active' ? (
                          <>
                            <button 
                              onClick={() => banUser(u.id, u.email)}
                              className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                              title="Banir Conta"
                            >
                              <ShieldAlert size={16} />
                            </button>
                            <button 
                              onClick={() => banIp(u.lastIp, u.email)}
                              className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
                              title="Banir IP"
                            >
                              <Ban size={16} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => unbanUser(u.id, u.email, u.lastIp)}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Desbanir Conta"
                          >
                            <ShieldCheck size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteUser(u.id, u.email)}
                          disabled={u.email?.toLowerCase() === "pedronobreneto27@gmail.com"}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                          title="Remover Usuário"
                        >
                          <Trash2 size={16} />
                        </button>
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
