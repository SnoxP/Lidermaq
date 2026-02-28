import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UpdateNotification = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Simula a detecção de uma atualização após 5 segundos
    // Em um cenário real, isso seria disparado por um Service Worker ou WebSocket
    const timer = setTimeout(() => {
      const hasSeenUpdate = sessionStorage.getItem('update_notified');
      if (!hasSeenUpdate) {
        setShow(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    sessionStorage.setItem('update_notified', 'true');
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
              <button onClick={() => setShow(false)} className="text-white/40 hover:text-white">
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
