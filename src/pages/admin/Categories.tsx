import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Trash2, Save, X, Edit2, RefreshCw, AlertTriangle, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, writeBatch } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export const Categories = () => {
  const [categories, setCategories] = useState<{id: string, name: string, order: number}[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const cats = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, order: doc.data().order || 0 }));
    // Sort by order
    cats.sort((a, b) => a.order - b.order);
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
      // Find max order
      const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;
      await addDoc(collection(db, 'categories'), { name: newCategory, order: maxOrder + 1 });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar categoria.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeed = async () => {
    const defaults = ['Padarias', 'Restaurantes', 'Açougues', 'Supermercados', 'Lanchonetes', 'Móveis Para Escritório'];
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      let order = 1;
      for (const name of defaults) {
        if (!categories.some(c => c.name === name)) {
           const ref = doc(collection(db, 'categories'));
           batch.set(ref, { name, order: order++ });
        }
      }
      await batch.commit();
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar categorias padrão.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newCategories[index].order;
    newCategories[index].order = newCategories[targetIndex].order;
    newCategories[targetIndex].order = tempOrder;
    
    // Update Firestore
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'categories', newCategories[index].id), { order: newCategories[index].order });
      batch.update(doc(db, 'categories', newCategories[targetIndex].id), { order: newCategories[targetIndex].order });
      await batch.commit();
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Erro ao reordenar.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Produtos nesta categoria não serão excluídos, mas ficarão sem categoria válida.')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir categoria.");
    }
  };

  const startEditing = (cat: {id: string, name: string}) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    setIsUpdating(true);
    try {
      const oldCategoryName = categories.find(c => c.id === id)?.name;

      // 1. Update category document
      await updateDoc(doc(db, 'categories', id), { name: editName });

      // 2. Update all products with this category
      if (oldCategoryName && oldCategoryName !== editName) {
        const q = query(collection(db, 'products'), where('category', '==', oldCategoryName));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const batch = writeBatch(db);
          querySnapshot.forEach((doc) => {
            batch.update(doc.ref, { category: editName });
          });
          await batch.commit();
        }
      }

      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar categoria e produtos relacionados.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-12">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/admin" className="hover:text-accent transition-colors">Painel Administrativo</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Categorias</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter dark:text-white">GERENCIAR CATEGORIAS</h1>
          <p className="text-primary/60 dark:text-zinc-400">Adicione ou remova os setores de produtos do site.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm mb-8">
          <form onSubmit={handleAdd} className="flex gap-4">
            <input 
              type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
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

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-bg dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold dark:text-white">Categorias Atuais</h3>
            <span className="text-xs text-zinc-400">{categories.length} categorias</span>
          </div>
          <div className="divide-y divide-neutral-bg dark:divide-white/5">
              {categories.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-4">
                <p className="text-primary/40 dark:text-zinc-500 italic">Nenhuma categoria cadastrada.</p>
                <button 
                  onClick={handleSeed}
                  disabled={isLoading}
                  className="text-accent hover:underline text-sm flex items-center gap-2"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  Gerar categorias padrão
                </button>
              </div>
            ) : (
              categories.map((cat, index) => (
                <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-neutral-bg/50 dark:hover:bg-white/5 transition-colors">
                  {editingId === cat.id ? (
                    <div className="flex-1 flex items-center gap-4 mr-4">
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-4 py-2 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                        autoFocus
                        disabled={isUpdating}
                      />
                      <button 
                        onClick={() => handleEdit(cat.id)}
                        disabled={isUpdating}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? <RefreshCw size={20} className="animate-spin"/> : <Save size={20} />}
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        disabled={isUpdating}
                        className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold dark:text-white">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors disabled:opacity-30"
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button 
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === categories.length - 1}
                          className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors disabled:opacity-30"
                        >
                          <ArrowDown size={18} />
                        </button>
                        <button 
                          onClick={() => startEditing(cat)}
                          className="p-3 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
