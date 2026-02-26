import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { PRODUCTS, CATEGORIES } from '../../data/mockData';
import { Database, Download, CheckCircle, AlertCircle } from 'lucide-react';

export const SeedData = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setStatus('loading');
    setMessage('Verificando banco de dados...');
    
    try {
      // Verificar se já existem produtos
      const q = query(collection(db, 'products'), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setStatus('error');
        setMessage('O banco de dados já contém produtos. Importação cancelada para evitar duplicatas.');
        return;
      }

      setMessage('Importando categorias...');
      for (const cat of CATEGORIES) {
        if (cat === 'Todos') continue;
        await addDoc(collection(db, 'categories'), { name: cat });
      }

      setMessage('Importando produtos...');
      for (const product of PRODUCTS) {
        const { id, ...productData } = product;
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }

      setStatus('success');
      setMessage('Catálogo inicial importado com sucesso!');
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      setStatus('error');
      setMessage('Erro ao conectar com o Firebase. Verifique suas chaves e permissões.');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4">
        <CheckCircle className="text-emerald-500 shrink-0" size={24} />
        <p className="text-emerald-700 font-bold text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-bg">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shrink-0">
          <Database size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">Importar Catálogo Inicial</h3>
          <p className="text-sm text-primary/60 leading-relaxed">
            Seu banco de dados está vazio. Deseja importar os produtos e categorias padrão do site para começar a editá-los?
          </p>
        </div>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-xs font-bold">
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <button
        onClick={handleSeed}
        disabled={status === 'loading'}
        className="w-full btn-primary py-4 flex justify-center items-center gap-2 disabled:opacity-50"
      >
        <Download size={20} />
        {status === 'loading' ? 'Importando...' : 'Importar Agora'}
      </button>
    </div>
  );
};
