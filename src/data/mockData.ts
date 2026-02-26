export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  installments: string;
  image: string;
  description: string;
  specs: {
    dimensions: string;
    weight: string;
    material: string;
    finish: string;
  };
  available: boolean;
}

export const PRODUCTS: Product[] = [];

export const CATEGORIES = ["Todos", "Padarias", "Restaurantes", "Açougues", "Supermercados", "Lanchonetes", "Móveis Para Escritório"];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Como otimizar o fluxo de trabalho na sua padaria",
    date: "20/02/2026",
    category: "Dicas Técnicas",
    excerpt: "Confira os equipamentos essenciais e como organizar a produção de pães.",
    image: "https://picsum.photos/seed/blog1/400/300"
  },
  {
    id: 2,
    title: "A importância da refrigeração correta no açougue",
    date: "15/02/2026",
    category: "Manutenção",
    excerpt: "Saiba como manter a qualidade das carnes com equipamentos de ponta.",
    image: "https://picsum.photos/seed/blog2/400/300"
  }
];
