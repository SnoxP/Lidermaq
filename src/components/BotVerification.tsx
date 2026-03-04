import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface BotVerificationProps {
  onVerificationChange: (isValid: boolean) => void;
}

export const BotVerification: React.FC<BotVerificationProps> = ({ onVerificationChange }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Generate numbers between 1 and 10
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  useEffect(() => {
    const calculated = num1 + num2;
    const userVal = parseInt(answer);
    // Check if answer is correct AND honeypot is empty
    const valid = !isNaN(userVal) && userVal === calculated && honeypot === '';
    
    setIsCorrect(valid);
    onVerificationChange(valid);
  }, [answer, honeypot, num1, num2, onVerificationChange]);

  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-white/5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck size={18} className="text-accent" />
        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Verificação de Segurança</span>
      </div>
      
      {/* Honeypot - Hidden field that bots might fill */}
      <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor="website_url_check">Não preencha este campo se for humano:</label>
        <input
          type="text"
          id="website_url_check"
          name="website_url_check"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-lg font-bold dark:text-white select-none bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-200 dark:border-white/5">
          {num1} + {num2} = ?
        </div>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className={`w-24 px-3 py-2 bg-white dark:bg-zinc-900 border rounded-lg focus:outline-none focus:ring-2 transition-all text-center font-bold ${
            isCorrect 
              ? 'border-green-500 ring-green-500/20 text-green-600 dark:text-green-400' 
              : 'border-zinc-200 dark:border-white/10 focus:ring-accent/50 dark:text-white'
          }`}
          placeholder="Resultado"
          required
        />
        {isCorrect && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-500 font-bold text-sm"
          >
            Correto!
          </motion.span>
        )}
      </div>
      <p className="text-[10px] text-zinc-400">Responda a soma para confirmar que você não é um robô.</p>
    </div>
  );
};
