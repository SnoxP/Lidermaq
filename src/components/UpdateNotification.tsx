import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UpdateNotification = () => {
  const [show, setShow] = useState(false);
  const CURRENT_VERSION = "1.0.2"; // Versão atual desta instância do código

  useEffect(() => {
    const checkUpdate = async () => {
      // Se o usuário já fechou o aviso nesta sessão, não mostra de novo
      if (sessionStorage.getItem('update_dismissed')) return;

      try {
        // Busca o arquivo de versão no servidor
        const response = await fetch('/version.json?t=' + Date.now(), {
          cache: 'no-store' // Garante que não pegue do cache do navegador
        });
        
        if (response.ok) {
          const data = await response.json();
          // Se a versão no servidor for diferente da versão atual no código
          if (data.version && data.version !== CURRENT_VERSION) {
            setShow(true);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar atualizações:", error);
      }
    };

    // Verifica a cada 30 segundos
    const interval = setInterval(checkUpdate, 30000);
    
    // Verifica também na montagem (com um pequeno delay)
    const initialTimer = setTimeout(checkUpdate, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('update_dismissed', 'true');
    setShow(false);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[110]"
        >
          <div className="bg-primary text-white p-6 rounded-3xl shadow-2xl border border-white/10 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center animate-spin-slow">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">Atualização!</h4>
                  <p className="text-white/60 text-sm">Nova versão disponível.</p>
                </div>
              </div>
              <button onClick={handleDismiss} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-white/80">
              Recarregue a página para aplicar a atualização e ver as novidades.
            </p>

            <button 
              onClick={handleReload}
              className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Recarregar Agora
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
