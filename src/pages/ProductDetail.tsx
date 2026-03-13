import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Truck, PenTool as Tool, ArrowLeft, Check, Share2, ChevronLeft, ChevronRight, ShoppingBag, Star, Send, Pencil } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { SEO } from '../components/SEO';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { calculateInstallments, formatCurrency } from '../utils/format';
import { AttendantSelector } from '../components/AttendantSelector';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [showAttendantSelector, setShowAttendantSelector] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const productToAdd = selectedVariant ? { ...product, price: selectedVariant.price, image: selectedVariant.image || product.image } : product;
    addToCart(productToAdd, selectedVariant?.name);
  };

  const handlePrevImage = () => {
    if (!product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(mainImage);
    const prevIndex = currentIndex <= 0 ? product.images.length - 1 : currentIndex - 1;
    setMainImage(product.images[prevIndex]);
  };

  const handleNextImage = () => {
    if (!product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(mainImage);
    const nextIndex = currentIndex >= product.images.length - 1 ? 0 : currentIndex + 1;
    setMainImage(product.images[nextIndex]);
  };

  const fetchComments = async () => {
    if (!id) return;
    try {
      const q = query(collection(db, 'comments'), where('productId', '==', id), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          setMainImage(data.images?.[0] || data.image || '');
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchComments();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (selectedVariant?.image) {
      setMainImage(selectedVariant.image);
    } else if (product) {
      setMainImage(product.images?.[0] || product.image || '');
    }
  }, [selectedVariant, product]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addDoc(collection(db, 'comments'), {
        productId: id,
        userId: user.id,
        userName: user.name || 'Usuário',
        text: newComment,
        rating,
        createdAt: new Date().toISOString()
      });
      setNewComment('');
      setRating(5);
      fetchComments();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      alert("Erro ao enviar avaliação.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center animate-pulse">
        <div className="w-20 h-20 bg-neutral-bg dark:bg-neutral-800 rounded-full mx-auto mb-4" />
        <p className="text-primary/40 dark:text-white/40 font-bold">Carregando detalhes...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/catalogo" className="btn-primary inline-flex">Voltar ao Catálogo</Link>
      </div>
    );
  }

  const productImage = mainImage || product.images?.[0] || product.image || 'https://picsum.photos/seed/lidermaq/800/800';
  const productPrice = selectedVariant?.price || product.price || 0;
  const productName = selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name;
  const productDescription = selectedVariant?.description || product.description || 'Sem descrição disponível para este produto.';
  const whatsappUrl = `https://wa.me/5589999170800?text=${encodeURIComponent(`Olá, tenho interesse no produto: ${productName} - Lidermaq`)}`;

  return (
    <div className="pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500">
      <SEO 
        title={product.name || 'Produto Lidermaq'}
        description={product.description?.substring(0, 160) || 'Confira este produto na Lidermaq.'}
        image={productImage}
      />
      <div className="container mx-auto px-4">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-accent font-bold mb-8 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-zinc-200 shadow-sm relative group"
            >
              {/* Adaptive Background */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${productImage})`,
                  backgroundSize: '5000% 5000%',
                  backgroundPosition: '2% 2%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <img src={productImage} alt={product.name} className="relative w-full h-full object-contain" referrerPolicy="no-referrer" />
              
              {product.images?.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 dark:text-white opacity-100 transition-opacity hover:bg-white dark:hover:bg-black shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 dark:text-white opacity-100 transition-opacity hover:bg-white dark:hover:bg-black shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden bg-white border-2 cursor-pointer transition-all relative ${mainImage === img ? 'border-accent shadow-md shadow-accent/20' : 'border-zinc-200 hover:border-accent/30'}`}
                  >
                    {/* Adaptive Background */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: '5000% 5000%',
                        backgroundPosition: '2% 2%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    <img src={img} alt="Thumb" className="relative w-full h-full object-contain hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-accent font-bold uppercase tracking-widest text-[10px] bg-accent/10 px-3 py-1 rounded-full">{product.category || 'Geral'}</span>
                <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px]">{product.brand || 'Lidermaq'}</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white font-display">{product.name || 'Produto sem nome'}</h1>
                {user?.isAdmin && (
                  <Link 
                    to={`/admin/editar-produto/${product.id}`}
                    className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-accent dark:hover:text-accent hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
                    title="Editar Produto"
                  >
                    <Pencil size={24} />
                  </Link>
                )}
              </div>
              
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">Selecione o Modelo</label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedVariant(null)}
                      className={`px-5 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${!selectedVariant ? 'border-accent bg-accent/5 text-accent shadow-sm' : 'border-zinc-200 dark:border-white/10 hover:border-accent/30 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900'}`}
                    >
                      {!selectedVariant || product.name.length <= 20 
                        ? product.name 
                        : `${product.name.substring(0, 20)}...`}
                    </button>
                    {product.variants.map((v: any, i: number) => {
                      const isActive = selectedVariant === v;
                      return (
                        <button 
                          key={i}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-5 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${isActive ? 'border-accent bg-accent/5 text-accent shadow-sm' : 'border-zinc-200 dark:border-white/10 hover:border-accent/30 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900'}`}
                        >
                          {isActive || v.name.length <= 20 
                            ? v.name 
                            : `${v.name.substring(0, 20)}...`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-black text-zinc-900 dark:text-white font-display">
                    {formatCurrency(productPrice)}
                  </span>
                  <span className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/50">
                    <Check size={14} /> Em estoque
                  </span>
                </div>
                <span className="text-accent font-bold text-sm">
                  {calculateInstallments(productPrice)}
                </span>
              </div>
              
              {selectedVariant?.description ? (
                <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] mb-8 transition-colors duration-300 border border-zinc-200 dark:border-white/5 shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white font-display text-lg">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    Descrição do Modelo
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {selectedVariant.description}
                  </p>
                </div>
              ) : product.descriptions && product.descriptions.length > 0 ? (
                product.descriptions.map((desc: any, index: number) => (
                  <div key={index} className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] mb-8 transition-colors duration-300 border border-zinc-200 dark:border-white/5 shadow-sm">
                    {desc.title && (
                      <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white font-display text-lg">
                        <span className="w-2 h-2 bg-accent rounded-full" />
                        {desc.title}
                      </h3>
                    )}
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                      {desc.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] mb-8 transition-colors duration-300 border border-zinc-200 dark:border-white/5 shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white font-display text-lg">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    {product.descriptionTitle || 'Descrição do Produto'}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {productDescription}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {product.available === false ? (
                  <div className="flex-1 py-4 px-6 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 font-bold rounded-2xl text-center text-lg flex items-center justify-center">
                    Produto Esgotado
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={handleAddToCart}
                      className="btn-primary flex-1 text-lg py-4 shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={24} /> Adicionar ao Carrinho
                    </button>
                    <button 
                      onClick={() => setShowAttendantSelector(!showAttendantSelector)}
                      className="btn-secondary flex-1 text-lg py-4 flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={24} /> Falar com Atendente
                    </button>
                  </>
                )}
                <button 
                  onClick={() => {
                    navigator.share?.({
                      title: product.name,
                      text: product.description,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copiado para a área de transferência!');
                    });
                  }}
                  className="btn-secondary px-6 flex items-center justify-center"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {showAttendantSelector && (
                <div className="mb-10 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10">
                  <AttendantSelector message={`Olá, tenho interesse no produto: ${productName} - Lidermaq`} />
                </div>
              )}

              {/* Badges */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-zinc-200 dark:border-white/10">
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Shield size={20} />
                  </div>
                  Garantia de 1 Ano
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Truck size={20} />
                  </div>
                  Entrega em Picos/PI
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Tool size={20} />
                  </div>
                  Montagem Inclusa
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Check size={20} />
                  </div>
                  Selo de Qualidade
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        {product.specs && (
          <div className="mt-24">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 dark:text-white font-display">ESPECIFICAÇÕES TÉCNICAS</h2>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[2rem] overflow-hidden transition-colors duration-300 shadow-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {product.specs.dimensions && (
                    <tr className="border-b border-zinc-200 dark:border-white/5">
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold w-1/3 dark:text-white">Medidas (LxPxA)</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.dimensions}</td>
                    </tr>
                  )}
                  {product.specs.weight && (
                    <tr className="border-b border-zinc-200 dark:border-white/5">
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold dark:text-white">Peso Aproximado</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.weight}</td>
                    </tr>
                  )}
                  {product.specs.material && (
                    <tr className="border-b border-zinc-200 dark:border-white/5">
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold dark:text-white">Material da Estrutura</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.material}</td>
                    </tr>
                  )}
                  {product.specs.finish && (
                    <tr>
                      <th className="p-6 bg-zinc-50 dark:bg-zinc-800/50 font-bold dark:text-white">Acabamento</th>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400">{product.specs.finish}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-24">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 dark:text-white font-display">AVALIAÇÕES DO PRODUTO</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Comment Form */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-white/5 transition-colors duration-300">
                <h3 className="font-bold mb-6 dark:text-white font-display">Deixe sua avaliação</h3>
                
                {user ? (
                  <form onSubmit={handleSubmitComment} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Sua Nota</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-2 rounded-xl transition-all ${rating >= star ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-300 dark:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                          >
                            <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Seu Comentário</label>
                      <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="O que você achou deste produto?"
                        rows={4}
                        className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-800 dark:text-white border border-zinc-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmittingComment}
                      className="w-full btn-primary py-4 flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      <Send size={20} />
                      {isSubmittingComment ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 dark:text-zinc-400 mb-4">Faça login para avaliar este produto.</p>
                    <Link to="/login" className="btn-primary inline-block">Fazer Login</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="lg:col-span-2 space-y-6">
              {comments.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-[2rem] text-center border border-zinc-200 dark:border-white/5 transition-colors duration-300">
                  <MessageCircle size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                  <p className="text-xl font-bold text-zinc-500 dark:text-zinc-400">Nenhuma avaliação ainda.</p>
                  <p className="text-zinc-400 dark:text-zinc-500 mt-2">Seja o primeiro a avaliar este produto!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold dark:text-white">{comment.userName}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                          {new Date(comment.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < comment.rating ? "currentColor" : "none"} className={i >= comment.rating ? "text-zinc-300 dark:text-zinc-700" : ""} />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
