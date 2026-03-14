import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Save, X, Eye, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const NewPost = () => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        excerpt,
        content,
        image,
        createdAt: new Date().toISOString()
      });
      navigate('/admin');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          <span className="text-zinc-900 dark:text-white font-medium">Nova Postagem</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter dark:text-white">NOVA POSTAGEM</h1>
            <p className="text-primary/60 dark:text-zinc-400">Escreva um novo artigo para o blog da Lidermaq.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-colors dark:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2">Título do Post</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Ex: 5 Dicas para manter seu forno industrial"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2">Resumo (Excerpt)</label>
              <input 
                type="text" required value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Um breve resumo para aparecer na listagem..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2">URL da Imagem de Capa</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 dark:text-zinc-500" size={20} />
                <input 
                  type="url" required value={image} onChange={(e) => setImage(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="https://link-da-imagem.com/capa.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 dark:text-zinc-500 mb-2">Conteúdo (Markdown)</label>
              <textarea 
                required value={content} onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-4 bg-neutral-bg dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-mono text-sm"
                placeholder="Escreva seu post aqui..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" disabled={isLoading}
              className="flex-1 btn-primary py-4 text-lg flex justify-center items-center gap-2"
            >
              <Save size={20} /> {isLoading ? 'Publicando...' : 'Publicar Postagem'}
            </button>
            <button 
              type="button"
              className="px-8 py-4 bg-white text-primary font-bold rounded-xl border border-neutral-bg hover:bg-neutral-bg transition-all flex items-center gap-2"
            >
              <Eye size={20} /> Visualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
