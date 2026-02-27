import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
      lastSeen: serverTimestamp(),
      isOnline: true
    }, { merge: true });
  };

  useEffect(() => {
    if (!auth || !db) {
      console.warn("Auth or DB not initialized. Check environment variables.");
      setLoading(false);
      return;
    }

    // Escuta mudanças no estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const isAdmin = await checkAdminStatus(firebaseUser.email);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0] || 'Usuário',
            isAdmin: isAdmin,
          });
          // Atualiza o status online sem travar a UI
          syncUserToFirestore(firebaseUser);
        } catch (e) {
          console.error("Erro ao sincronizar usuário:", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Sistema de autenticação não disponível.");
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await syncUserToFirestore(result.user);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error("Sistema de autenticação não disponível.");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await updateProfile(result.user, { displayName: name });
      await syncUserToFirestore(result.user, name);
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword, loading }}>
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
