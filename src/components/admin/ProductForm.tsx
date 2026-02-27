import React, { useState, useEffect, useRef } from 'react';
import { PackagePlus, Image as ImageIcon, Sparkles, Save, X, Plus, Wand2, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../services/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateOrImproveDescription, identifyProductSector } from '../../services/geminiService';

interface ProductFormProps {
  productId?: string;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ productId, isEdit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!db) return;
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const cats = querySnapshot.docs.map(doc => doc.data().name);
      if (cats.length === 0) {
        setAvailableCategories(['Padarias', 'Restaurantes', 'Açougues', 'Supermercados', 'Lanchonetes', 'Móveis Para Escritório']);
      } else {
        setAvailableCategories(cats);
      }
    };

    const fetchProduct = async () => {
      if (isEdit && productId && db) {
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (productDoc.exists()) {
          const data = productDoc.data();
          setName(data.name || '');
          setPrice(data.price?.toString() || '');
          setBrand(data.brand || '');
          setDescription(data.description || '');
          setCategory(data.category || '');
          setImages(data.images || ['']);
        }
      }
    };

    fetchCategories();
    fetchProduct();
  }, [isEdit, productId]);

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setIsUploading(index);
    try {
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const newImages = [...images];
      newImages[index] = downloadURL;
      setImages(newImages);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha ao carregar imagem. Verifique as permissões do Firebase Storage.");
    } finally {
      setIsUploading(null);
    }
  };

  const identifyCategory = async () => {
    if (!description) return;
    setIsIdentifying(true);
    try {
      const identified = await identifyProductSector(description);
      if (identified && availableCategories.includes(identified)) {
        setCategory(identified);
      }
    } catch (error) {
      console.error("Erro ao identificar categoria:", error);
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleAIDescription = async () => {
    if (!name || !brand) {
      alert("Por favor, preencha o nome e a marca do produto primeiro.");
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const generated = await generateOrImproveDescription(name, brand, description);
      if (generated) {
        setDescription(generated);
      }
    } catch (error) {
      console.error("Erro ao processar descrição com IA:", error);
    } finally {
      setIsGeneratingDesc(false);
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
    
    // Timeout de segurança para não ficar travado no "Salvando..."
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        alert("A operação está demorando mais que o esperado. Verifique sua conexão ou as regras do Firebase.");
      }
    }, 10000);

    try {
      const productData = {
        name,
        price: parseFloat(price),
        brand,
        description,
        category,
        image: images.filter(img => img !== '')[0] || '',
        images: images.filter(img => img !== ''),
        installments: `10x de R$ ${(parseFloat(price) / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        available: true,
        updatedAt: new Date().toISOString()
      };

      if (isEdit && productId) {
        await updateDoc(doc(db, 'products', productId), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }
      
      clearTimeout(timeoutId);
      // Redireciona para o catálogo público para ver o resultado na hora
      navigate('/catalogo');
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Erro ao salvar produto:", error);
      alert(`Erro ao salvar: ${error.message || "Verifique as permissões do banco de dados."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-neutral-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">{isEdit ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}</h1>
            <p className="text-primary/60">{isEdit ? 'Atualize as informações do item selecionado.' : 'Adicione um novo item ao catálogo da Lidermaq.'}</p>
          </div>
          <button onClick={() => navigate('/admin/produtos')} className="p-3 hover:bg-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {!db && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-4">
            <AlertCircle className="text-amber-600 shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-amber-900">Banco de Dados não configurado</h3>
              <p className="text-sm text-amber-700 mt-1">
                O arquivo <strong>.env</strong> com as chaves do Firebase foi removido ou está incompleto. 
                Os produtos salvos agora não serão persistidos no banco de dados real.
              </p>
            </div>
          </div>
        )}

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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 ml-1">Descrição</label>
                <button 
                  type="button"
                  onClick={handleAIDescription}
                  disabled={isGeneratingDesc || !name || !brand}
                  className="text-accent text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  <Wand2 size={14} className={isGeneratingDesc ? "animate-pulse" : ""} />
                  {isGeneratingDesc ? 'Processando...' : (description.length > 10 ? 'Melhorar com IA' : 'Gerar com IA')}
                </button>
              </div>
              <textarea 
                required value={description} onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Descreva o produto detalhadamente ou use a IA para gerar uma descrição..."
              />
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
                  <div className="flex-1 relative">
                    <input 
                      type="url" value={url} onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full pl-4 pr-12 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="https://link-da-imagem.com/foto.jpg"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <label className="p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-accent" title="Upload do dispositivo">
                        {isUploading === index ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Upload size={20} />
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(index, e)}
                          disabled={isUploading !== null}
                        />
                      </label>
                    </div>
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
              <Save size={20} /> {isLoading ? 'Salvando...' : (isEdit ? 'Salvar Alterações' : 'Publicar Produto')}
            </button>
            <button 
              type="button" onClick={() => navigate('/admin/produtos')}
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
