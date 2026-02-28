import React, { useState, useEffect, useRef } from 'react';
import { PackagePlus, Image as ImageIcon, Save, X, Plus, AlertCircle, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

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
  const [variants, setVariants] = useState<{ name: string; price: string; image?: string; description?: string }[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!db) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const cats = querySnapshot.docs.map(doc => doc.data().name);
        if (cats.length === 0) {
          setAvailableCategories(['Padarias', 'Restaurantes', 'Açougues', 'Supermercados', 'Lanchonetes', 'Móveis Para Escritório']);
        } else {
          setAvailableCategories(cats);
        }
      } catch (e) {
        setAvailableCategories(['Padarias', 'Restaurantes', 'Açougues', 'Supermercados', 'Lanchonetes', 'Móveis Para Escritório']);
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
          setVariants(data.variants || []);
        }
      }
    };

    fetchCategories();
    fetchProduct();
  }, [isEdit, productId]);

  const uploadFile = async (index: number, file: File) => {
    if (!IMGBB_API_KEY || IMGBB_API_KEY === "sua_chave_aqui") {
      alert("Chave de API do ImgBB não configurada. Por favor, adicione VITE_IMGBB_API_KEY ao seu .env");
      return;
    }

    setIsUploading(index);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const newImages = [...images];
        newImages[index] = data.data.url;
        setImages(newImages);
      } else {
        throw new Error(data.error?.message || "Erro no upload");
      }
    } catch (error: any) {
      console.error("Erro no upload ImgBB:", error);
      alert(`Falha no upload: ${error.message || "Verifique sua chave de API."}`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(index, file);
  };

  const handlePaste = async (index: number, e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          await uploadFile(index, file);
          break;
        }
      }
    }
  };

  const handleAddImage = () => setImages([...images, '']);
  const handleRemoveImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleAddVariant = () => setVariants([...variants, { name: '', price: '', description: '' }]);
  const handleRemoveVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  const handleVariantChange = (index: number, field: 'name' | 'price' | 'image' | 'description', value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
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
        variants: variants.filter(v => v.name !== ''),
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
                <select 
                  required value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none"
                >
                  <option value="">Selecione...</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/40 ml-1">Descrição</label>
              </div>
              <textarea 
                required value={description} onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Descreva o produto detalhadamente..."
              />
            </div>
          </div>

          {/* Variantes do Produto */}
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <PackagePlus className="text-accent" /> Modelos / Variações
              </h3>
              <button 
                type="button" onClick={handleAddVariant}
                className="text-accent font-bold text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={18} /> Adicionar Variação
              </button>
            </div>
            <p className="text-sm text-primary/60 mb-4">Use esta opção para cadastrar diferentes tamanhos, capacidades ou modelos do mesmo produto (ex: 50L, 100L).</p>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="p-6 bg-neutral-bg rounded-2xl space-y-4 relative">
                  <button 
                    type="button" onClick={() => handleRemoveVariant(index)}
                    className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Nome da Variação</label>
                      <input 
                        type="text" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                        placeholder="Ex: Modelo 50 Litros"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Preço da Variação (R$)</label>
                      <input 
                        type="number" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Link da Imagem (Opcional)</label>
                    <input 
                      type="url" value={variant.image || ''} onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Descrição da Variação (Opcional)</label>
                    <textarea 
                      value={variant.description || ''} onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Se vazio, usará a descrição principal..."
                    />
                  </div>
                </div>
              ))}
              {variants.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-neutral-bg rounded-3xl text-primary/30">
                  Nenhuma variação adicionada.
                </div>
              )}
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
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
                      <LinkIcon size={18} />
                    </div>
                    <input 
                      type="url" value={url} onChange={(e) => handleImageChange(index, e.target.value)}
                      onPaste={(e) => handlePaste(index, e)}
                      className="w-full pl-12 pr-12 py-4 bg-neutral-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Cole o link ou pressione Ctrl+V para colar uma imagem"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <label className="p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-accent group" title="Upload do dispositivo (Grátis via ImgBB)">
                        {isUploading === index ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Upload size={20} />
                            <span className="text-[8px] font-bold uppercase hidden group-hover:block">Upload</span>
                          </div>
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
