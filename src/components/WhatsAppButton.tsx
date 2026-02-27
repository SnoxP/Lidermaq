import React, { useState } from 'react';
import { MessageCircle, User } from 'lucide-react';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const contacts = [
    { name: 'Jonas', number: '5589999170800' },
    { name: 'Lena', number: '5589999861264' }
  ];

  const message = encodeURIComponent("Olá, tenho interesse nos equipamentos da Lidermaq!");

  return (
    <div className="fixed bottom-28 right-6 lg:bottom-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {contacts.map((contact) => (
            <a
              key={contact.number}
              href={`https://wa.me/${contact.number}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-4 py-2 rounded-xl shadow-xl font-bold text-sm flex items-center gap-2 hover:bg-accent hover:text-white transition-all border border-neutral-bg"
            >
              <User size={16} />
              Falar com {contact.name}
            </a>
          ))}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group relative"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={28} />
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-white text-primary px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-neutral-bg">
            Fale Conosco
          </span>
        )}
      </button>
    </div>
  );
};
