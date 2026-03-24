import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Truck, PenTool as Tool, ArrowLeft, Check, Share2, ChevronLeft, ChevronRight, ShoppingBag, Star, Send, Pencil, ChevronRight as ChevronRightIcon, X } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { SEO } from '../components/SEO';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { calculateInstallments, formatCurrency } from '../utils/format';
import { AttendantSelector } from '../components/AttendantSelector';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showAttendantSelector, setShowAttendantSelector] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    const productToAdd = selectedVariant ? { ...product, price: selectedVariant.price, image: selectedVariant.image || product.image } : product;
    addToCart(productToAdd, selectedVariant?.name);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    const productToAdd = selectedVariant ? { ...product, price: selectedVariant.price, image: selectedVariant.image || product.image } : product;
    addToCart(productToAdd, selectedVariant?.name);
    setIsCartOpen(false);
    navigate('/checkout');
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
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
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
      <div className="pt-40 pb-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Produto não encontrado</h1>
        <Link to="/catalogo" className="px-6 py-3 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 transition-colors">Voltar ao Catálogo</Link>
      </div>
    );
  }

  const productImage = mainImage || product.images?.[0] || product.image || 'https://picsum.photos/seed/lidermaq/800/800';
  const productPrice = selectedVariant?.price || product.price || 0;
  const productName = selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name;
  const productDescription = selectedVariant?.description || product.description || 'Sem descrição disponível para este produto.';
  const whatsappUrl = `https://wa.me/5589999170800?text=${encodeURIComponent(`Olá, tenho interesse no produto: ${productName} - Lidermaq`)}`;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO 
        title={product.name || 'Produto Lidermaq'}
        description={product.description?.substring(0, 160) || 'Confira este produto na Lidermaq.'}
        image={productImage}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRightIcon size={14} className="mx-2" />
          <Link to="/catalogo" className="hover:text-accent transition-colors">Catálogo</Link>
          {product.category && (
            <>
              <ChevronRightIcon size={14} className="mx-2" />
              <Link to={`/catalogo?cat=${product.category}`} className="hover:text-accent transition-colors">{product.category}</Link>
            </>
          )}
          <ChevronRightIcon size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-zinc-100 dark:border-zinc-800 relative group">
                {!isImageLoaded && (
                  <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                )}
                <img 
                  src={productImage} 
                  alt={product.name} 
                  className={`w-full h-full object-contain p-8 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                  fetchPriority="high" 
                  loading="eager" 
                  referrerPolicy="no-referrer" 
                  onLoad={() => setIsImageLoaded(true)}
                />
                
                {product.images?.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-md rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-md rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all bg-white ${
                        mainImage === img ? 'border-accent' : 'border-zinc-200 dark:border-zinc-800 hover:border-accent/50'
                      }`}
                    >
                      <img src={img} alt={`${product.name} - Imagem ${idx + 1}`} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full">{product.brand}</span>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">Ref: {product.id.substring(0, 8)}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white leading-tight mb-4 font-display">
                  {productName}
                </h1>
                
                {/* Rating Summary */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">({comments.length} avaliações)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-6 mb-8 border border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col mb-4">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-accent font-display leading-none">
                      {formatCurrency(productPrice)}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <CreditCardIcon size={16} />
                  <span>em até <strong className="text-zinc-900 dark:text-white">10x de {formatCurrency(productPrice / 10)}</strong> sem juros</span>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">Opções Disponíveis</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          selectedVariant?.name === variant.name
                            ? 'border-accent bg-accent/5 text-accent shadow-sm'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-accent/50 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 px-8 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-lg shadow-zinc-900/20 dark:shadow-white/10"
                >
                  <ShoppingBag size={20} />
                  Adicionar ao Carrinho
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-4 px-8 rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                >
                  <ShoppingBag size={20} />
                  Comprar Agora
                </button>
              </div>

              {/* Features/Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-8 mt-auto">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Entrega Rápida</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Para Picos e Região</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Compra Segura</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Ambiente 100% protegido</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <Tool size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Garantia Lidermaq</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Assistência Especializada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Details Tabs */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 lg:p-10 mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 font-display">Descrição do Produto</h2>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {productDescription}
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-display">Avaliações de Clientes</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">5.0</span>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">({comments.length})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Add Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Deixe sua avaliação</h3>
                {user ? (
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Sua nota</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-zinc-300 dark:text-zinc-700'}`}
                          >
                            <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Seu comentário</label>
                      <textarea
                        id="comment"
                        rows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent focus:border-transparent dark:text-white resize-none"
                        placeholder="O que você achou deste produto?"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 px-4 rounded-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Faça login para avaliar este produto.</p>
                    <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`} className="inline-flex items-center justify-center px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                      Fazer Login
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold uppercase">
                            {comment.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white text-sm">{comment.userName}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} fill={comment.rating >= star ? 'currentColor' : 'none'} className={comment.rating >= star ? '' : 'text-zinc-300 dark:text-zinc-700'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mt-3">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <MessageCircle size={32} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAttendantSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full relative">
            <button 
              onClick={() => setShowAttendantSelector(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 dark:text-white">Falar com Atendente</h3>
            <AttendantSelector 
              message={`Olá, tenho interesse no produto: ${productName} - Lidermaq`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for CreditCard icon since it wasn't imported
function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
