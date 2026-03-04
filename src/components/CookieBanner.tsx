import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 w-full z-[60] p-4"
        >
          <div className="container mx-auto max-w-4xl bg-white dark:bg-zinc-900 shadow-2xl border border-neutral-bg dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2 dark:text-white">Privacidade e Cookies</h4>
              <p className="text-sm text-primary/70 dark:text-zinc-400">
                Utilizamos cookies para melhorar sua experiência em nosso site. Ao continuar navegando, você concorda com nossa <a href="/privacidade" className="text-accent underline">Política de Privacidade</a>.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button 
                onClick={accept}
                className="bg-primary dark:bg-white dark:text-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 dark:hover:bg-zinc-200 transition-colors"
              >
                Aceitar Tudo
              </button>
              <button 
                onClick={() => setShow(false)}
                className="border border-neutral-bg dark:border-white/10 px-6 py-2 rounded-lg text-sm font-bold hover:bg-neutral-bg dark:hover:bg-white/5 dark:text-white transition-colors"
              >
                Personalizar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
