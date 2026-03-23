import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, runTransaction, onSnapshot } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  tag?: string;
  createdAt?: any;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  birthDate?: string;
  photoURL?: string;
  totalOrders?: number;
  totalSpent?: number;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Email mestre que sempre será admin
const MASTER_ADMIN = "pedronobreneto27@gmail.com";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (email: string): Promise<boolean> => {
    if (email === MASTER_ADMIN) return true;
    
    try {
      const adminDoc = await getDoc(doc(db, 'admins', email));
      return adminDoc.exists();
    } catch (error) {
      console.error("Erro ao verificar status de admin:", error);
      return false;
    }
  };

  const syncUserToFirestore = async (firebaseUser: FirebaseUser, name?: string) => {
    if (!firebaseUser.email) return;
    
    let ip = '';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ip = data.ip;
    } catch (e) {
      console.error("Erro ao buscar IP:", e);
    }

    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    let tag = '';
    let createdAt = serverTimestamp();
    
    if (!userDoc.exists() || !userDoc.data().tag) {
      const counterRef = doc(db, 'metadata', 'userCounter');
      try {
        const newTagNum = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          let nextId = 1;
          if (counterDoc.exists()) {
            nextId = (counterDoc.data().count || 0) + 1;
          }
          transaction.set(counterRef, { count: nextId }, { merge: true });
          return nextId;
        });
        tag = `#${newTagNum.toString().padStart(4, '0')}`;
      } catch (error) {
        console.error("Erro ao gerar tag:", error);
        tag = `#${Math.floor(1000 + Math.random() * 9000)}`;
      }
    } else {
      tag = userDoc.data().tag;
      createdAt = userDoc.data().createdAt || serverTimestamp();
    }

    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: name || firebaseUser.displayName || (userDoc.exists() ? userDoc.data().name : null) || firebaseUser.email.split('@')[0],
      tag,
      createdAt,
      lastSeen: serverTimestamp(),
      isOnline: true,
      lastIp: ip
    }, { merge: true });
  };

  const checkBanStatus = async (uid: string, ip: string, email: string): Promise<boolean> => {
    try {
      // Check user ban
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists() && userDoc.data().isBanned) {
        return true;
      }
      
      // Admins bypass IP bans
      const isAdmin = await checkAdminStatus(email);
      if (isAdmin) {
        return false;
      }

      // Check IP ban
      if (ip) {
        const ipDoc = await getDoc(doc(db, 'banned_ips', ip.replace(/\./g, '_')));
        if (ipDoc.exists()) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Erro ao verificar status de banimento:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!auth || !db) {
      console.warn("Auth or DB not initialized. Check environment variables.");
      setLoading(false);
      return;
    }

    let unsubscribeSnapshot: (() => void) | null = null;

    // Escuta mudanças no estado de autenticação do Firebase
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (firebaseUser && firebaseUser.email) {
        setLoading(true); // Prevent redirects while fetching user data
        try {
          // 1. Inicia a verificação de admin (rápida)
          let isAdmin = firebaseUser.email === MASTER_ADMIN;
          
          checkAdminStatus(firebaseUser.email).then(status => {
            if (status !== isAdmin) {
              isAdmin = status;
              setUser(prev => prev ? { ...prev, isAdmin } : null);
            }
          });
          
          // 2. Configura o listener do usuário imediatamente
          unsubscribeSnapshot = onSnapshot(doc(db, 'users', firebaseUser.uid), (userDoc) => {
            const userData = userDoc.exists() ? userDoc.data() : {};
            
            setUser(prev => {
              const fetchedName = userData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário';
              // Preserve the name if it was already set by register() and is not just the email prefix
              const finalName = (prev && prev.name && prev.name !== firebaseUser.email?.split('@')[0]) ? prev.name : fetchedName;
              
              return {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                name: finalName,
                isAdmin: isAdmin,
                tag: userData.tag,
                createdAt: userData.createdAt,
                phone: userData.phone,
                cep: userData.cep,
                street: userData.street,
                number: userData.number,
                neighborhood: userData.neighborhood,
                city: userData.city,
                state: userData.state,
                birthDate: userData.birthDate,
                photoURL: userData.photoURL || firebaseUser.photoURL,
                totalOrders: userData.totalOrders || 0,
                totalSpent: userData.totalSpent || 0
              };
            });
            setLoading(false);
          }, (error) => {
            console.error("Erro ao ouvir documento do usuário:", error);
            setLoading(false);
          });

          // 3. Executa a verificação de IP e banimento em background (não trava a UI)
          (async () => {
            try {
              let ip = '';
              try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                ip = data.ip;
              } catch (e) {
                console.error("Erro ao buscar IP:", e);
              }

              const isBanned = await checkBanStatus(firebaseUser.uid, ip, firebaseUser.email!);
              
              if (isBanned) {
                await signOut(auth);
                setUser(null);
                alert("Sua conta ou IP foi banido do sistema.");
              } else {
                // Atualiza o status online sem travar a UI
                syncUserToFirestore(firebaseUser);
              }
            } catch (e) {
              console.error("Erro na verificação de background:", e);
            }
          })();

        } catch (e) {
          console.error("Erro ao configurar usuário:", e);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Sistema de autenticação não disponível.");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        // Não aguarda a sincronização para não travar o login
        syncUserToFirestore(result.user).catch(console.error);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error("Sistema de autenticação não disponível.");
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        setUser(prev => prev ? { ...prev, name } : null);
        // Não aguarda a sincronização para não travar o cadastro
        syncUserToFirestore(result.user, name).catch(console.error);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.id), { isOnline: false }, { merge: true });
      } catch (e) {
        console.error("Erro ao atualizar status offline:", e);
      }
    }
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Sistema de autenticação não disponível.");
    await sendPasswordResetEmail(auth, email);
  };

  const deleteAccount = async () => {
    if (!auth || !auth.currentUser) throw new Error("Usuário não autenticado.");
    
    try {
      const uid = auth.currentUser.uid;
      // Exclui o documento do usuário no Firestore
      await deleteDoc(doc(db, 'users', uid));
      // Exclui o usuário da autenticação do Firebase
      await deleteUser(auth.currentUser);
      setUser(null);
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      if (error.code === 'auth/requires-recent-login') {
        throw new Error("Por motivos de segurança, você precisa fazer login novamente antes de excluir sua conta. Por favor, saia e entre novamente.");
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
