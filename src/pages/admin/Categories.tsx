import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Trash2, Save, X } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const Categories = () => {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const cats = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    setCategories(cats);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'categories'), { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter">GERENCIAR CATEGORIAS</h1>
          <p className="text-primary/60">Adicione ou remova os setores de produtos do site.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mb-8">
          <form onSubmit={handleAdd} className="flex gap-4">
            <input 
              type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Nome da nova categoria..."
            />
            <button 
              type="submit" disabled={isLoading}
              className="btn-primary px-6 flex items-center gap-2"
            >
              <Plus size={20} /> {isLoading ? '...' : 'Adicionar'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-bg">
            <h3 className="font-bold">Categorias Atuais</h3>
          </div>
          <div className="divide-y divide-neutral-bg">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-primary/40 italic">Nenhuma categoria cadastrada.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-neutral-bg/50 transition-colors">
                  <span className="font-bold">{cat.name}</span>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
