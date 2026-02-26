import React from 'react';
import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-primary font-bold tracking-widest uppercase text-sm"
        >
          Lidermaq
        </motion.p>
      </div>
    </div>
  );
};
