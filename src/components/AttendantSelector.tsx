import React from 'react';
import { MessageCircle, User } from 'lucide-react';

interface AttendantSelectorProps {
  message?: string;
  className?: string;
}

export const AttendantSelector: React.FC<AttendantSelectorProps> = ({ 
  message = "Olá, tenho interesse em um produto!",
  className = ""
}) => {
  const contacts = [
    { name: 'Jonas', number: '5589999170800' },
    { name: 'Lena', number: '5589999861264' }
  ];

  const encodedMessage = encodeURIComponent(message);

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm font-bold text-zinc-900 dark:text-white">Escolha um atendente para falar sobre este produto:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contacts.map((contact) => (
          <a
            key={contact.number}
            href={`https://wa.me/${contact.number}?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl hover:border-accent transition-all group"
          >
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold dark:text-white">{contact.name}</p>
              <p className="text-xs text-zinc-500">Atendimento Lidermaq</p>
            </div>
            <MessageCircle size={16} className="ml-auto text-zinc-400 group-hover:text-accent" />
          </a>
        ))}
      </div>
    </div>
  );
};
