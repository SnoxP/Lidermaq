import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BotVerification } from '../components/BotVerification';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      setError('Por favor, complete a verificação de segurança.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate('/perfil');
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Falha no cadastro. Verifique os dados e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-20 min-h-screen bg-neutral-bg dark:bg-zinc-950 flex items-center justify-center px-4 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 md:p-12 border border-transparent dark:border-white/5"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2 dark:text-white">CRIAR CONTA</h1>
          <p className="text-primary/60 dark:text-zinc-400">Junte-se à Lidermaq hoje mesmo</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2 ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 dark:text-zinc-600" size={20} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="Seu Nome"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 dark:text-zinc-600" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 dark:text-zinc-600" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <BotVerification onVerificationChange={setIsVerified} />

          <button 
            type="submit" 
            disabled={isLoading || !isVerified}
            className={`w-full btn-primary py-4 text-lg flex justify-center items-center gap-2 ${(!isVerified || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Criando conta...' : (
              <>Cadastrar <UserPlus size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-primary/60 dark:text-zinc-400 text-sm">
            Já tem uma conta? <Link to="/login" className="text-accent font-bold hover:underline">Entre aqui</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
