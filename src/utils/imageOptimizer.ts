/**
 * Utilitário para otimização de imagens de alto desempenho.
 * Converte URLs para WebP compactado via CDN global (Cloudflare edge)
 * reduzindo o tamanho em até 90% e acelerando o carregamento drasticamente.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100, padrão 80
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  fit?: 'contain' | 'cover' | 'fill' | 'inside';
}

export const FALLBACK_IMAGE = 'https://placehold.co/400x300/e2e8f0/64748b?text=Sem+Imagem';

export function getOptimizedImageUrl(
  url?: string | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return FALLBACK_IMAGE;
  }

  const cleanUrl = url.trim();

  // Se já for data URL, blob, SVG ou caminho local relativo
  if (
    cleanUrl.startsWith('data:') ||
    cleanUrl.startsWith('blob:') ||
    cleanUrl.startsWith('/assets/') ||
    cleanUrl.endsWith('.svg') ||
    cleanUrl.startsWith('/')
  ) {
    return cleanUrl;
  }

  // Se já for da CDN wsrv.nl
  if (cleanUrl.includes('wsrv.nl')) {
    return cleanUrl;
  }

  // Validação básica se é URL válida HTTP/HTTPS
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  const {
    width = 500,
    quality = 80,
    format = 'webp',
    fit
  } = options;

  const params = new URLSearchParams();
  // wsrv.nl aceita a URL sem o protocolo https:// para encurtar ou com ele
  params.set('url', cleanUrl);
  if (width) params.set('w', width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (fit) params.set('fit', fit);
  params.set('q', quality.toString());
  params.set('output', format);
  params.set('maxage', '31d'); // Cache longo no navegador e na borda

  return `https://wsrv.nl/?${params.toString()}`;
}
