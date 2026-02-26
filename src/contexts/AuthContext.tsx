import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulação de persistência de login
  useEffect(() => {
    const savedUser = localStorage.getItem('lidermaq_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Simulação de login
    // Em um app real, aqui você chamaria Firebase, Supabase ou seu próprio backend
    setLoading(true);
    
    // Mock de usuário admin para teste
    const mockUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      isAdmin: email.includes('admin'), // Se o email tiver 'admin', vira admin
    };

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(mockUser);
        localStorage.setItem('lidermaq_user', JSON.stringify(mockUser));
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lidermaq_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
