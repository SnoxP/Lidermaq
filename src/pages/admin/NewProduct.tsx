import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, Image as ImageIcon, Sparkles, Save, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const NewProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const cats = querySnapshot.docs.map(doc => doc.data().name);
      if (cats.length === 0) {
        setAvailableCategories(['Padarias', 'Restaurantes', 'Açougues', 'Supermercados', 'Lanchonetes', 'Móveis Para Escritório']);
      } else {
        setAvailableCategories(cats);
      }
    };
    fetchCategories();
  }, []);

  const identifyCategory = async () => {
    if (!description) return;
    setIsIdentifying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Com base nesta descrição de produto: "${description}", escolha a categoria mais adequada entre as seguintes: ${availableCategories.join(', ')}. Responda APENAS o nome da categoria.`,
      });
      
      const identified = response.text?.trim();
      if (identified && availableCategories.includes(identified)) {
        setCategory(identified);
      }
    } catch (error) {
      console.error("Erro ao identificar categoria:", error);
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleAddImage = () => setImages([...images, '']);
  const handleRemoveImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        brand,
        description,
        category,
        images: images.filter(img => img !== ''),
        createdAt: new Date().toISOString()
      });
      navigate('/admin');
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">NOVO PRODUTO</h1>
            <p className="text-primary/60">Adicione um novo item ao catálogo da Lidermaq.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="p-3 hover:bg-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2">Nome do Produto</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Ex: Forno Industrial G.Paniz"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2">Marca</label>
                <input 
                  type="text" required value={brand} onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Ex: G.Paniz"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2">Preço (R$)</label>
                <input 
                  type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2">Categoria</label>
                <div className="flex gap-2">
                  <select 
                    required value={category} onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none"
                  >
                    <option value="">Selecione...</option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={identifyCategory}
                    disabled={isIdentifying || !description}
                    className="px-4 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    title="Identificar categoria com IA"
                  >
                    <Sparkles size={20} className={isIdentifying ? "animate-pulse" : ""} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 mb-2">Descrição</label>
              <textarea 
                required value={description} onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Descreva o produto detalhadamente..."
              />
              <p className="text-[10px] text-primary/40 mt-2">DICA: Escreva a descrição primeiro para usar a identificação automática de categoria.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="text-accent" /> Imagens do Produto
              </h3>
              <button 
                type="button" onClick={handleAddImage}
                className="text-accent font-bold text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={18} /> Adicionar Imagem
              </button>
            </div>

            <div className="space-y-4">
              {images.map((url, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input 
                      type="url" value={url} onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="https://link-da-imagem.com/foto.jpg"
                    />
                  </div>
                  {images.length > 1 && (
                    <button 
                      type="button" onClick={() => handleRemoveImage(index)}
                      className="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" disabled={isLoading}
              className="flex-1 btn-primary py-4 text-lg flex justify-center items-center gap-2"
            >
              <Save size={20} /> {isLoading ? 'Salvando...' : 'Publicar Produto'}
            </button>
            <button 
              type="button" onClick={() => navigate('/admin')}
              className="px-8 py-4 bg-white text-primary font-bold rounded-xl border border-neutral-bg hover:bg-neutral-bg transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
