import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl, FALLBACK_IMAGE, ImageOptimizationOptions } from '../utils/imageOptimizer';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  options?: ImageOptimizationOptions;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  priority = false,
  options = {},
  className = '',
  containerClassName = '',
  onLoad,
  onError,
  ...props
}) => {
  // Gera a URL otimizada (WebP comprimido via CDN de alta velocidade)
  const initialOptimized = getOptimizedImageUrl(src, options);

  const [currentSrc, setCurrentSrc] = useState<string>(initialOptimized);
  const [retryStage, setRetryStage] = useState<'optimized' | 'original' | 'fallback'>('optimized');
  const [isLoaded, setIsLoaded] = useState(false);

  // Se o src mudar externamente, reinicia o estado
  useEffect(() => {
    const newOptimized = getOptimizedImageUrl(src, options);
    setCurrentSrc(newOptimized);
    setRetryStage('optimized');
    setIsLoaded(false);
  }, [src, options.width, options.height, options.quality]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retryStage === 'optimized' && src && src !== currentSrc) {
      // Se a CDN falhar (ex: domínio que bloqueia proxy ou timeout), tenta carregar a imagem original direta
      setRetryStage('original');
      setCurrentSrc(src);
    } else if (retryStage !== 'fallback') {
      // Se a original também falhar, carrega o placeholder final
      setRetryStage('fallback');
      setCurrentSrc(fallbackSrc);
      setIsLoaded(true);
      if (onError) onError(e);
    } else {
      setIsLoaded(true);
      if (onError) onError(e);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton / placeholder animado suave enquanto carrega */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 animate-pulse z-0 pointer-events-none" />
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? 'eager' : (props.loading || 'lazy')}
        decoding="async"
        fetchPriority={priority ? 'high' : (props.fetchPriority || 'auto')}
        referrerPolicy="no-referrer"
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};
