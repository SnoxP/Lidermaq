export interface Product {
  id: string;
  name: string;
  category: string;
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

export const PRODUCTS: Product[] = [
  {
    id: "forno-turbo-pro",
    name: "Forno Turbo Profissional 5 Esteiras",
    category: "Gastronomia",
    price: 5890.00,
    installments: "10x de R$ 589,00",
    image: "https://picsum.photos/seed/oven1/800/600",
    description: "Forno de alta performance para padarias e restaurantes. Tecnologia de convecção para assamento uniforme.",
    specs: {
      dimensions: "100cm x 110cm x 160cm",
      weight: "120kg",
      material: "Aço Inox 430",
      finish: "Escovado"
    },
    available: true
  },
  {
    id: "freezer-horizontal-dupla-acao",
    name: "Freezer Horizontal Dupla Ação 500L",
    category: "Refrigeração",
    price: 3450.00,
    installments: "10x de R$ 345,00",
    image: "https://picsum.photos/seed/freezer1/800/600",
    description: "Freezer robusto com função de congelamento rápido e conservação de resfriados.",
    specs: {
      dimensions: "155cm x 70cm x 90cm",
      weight: "75kg",
      material: "Aço Pré-pintado",
      finish: "Branco Epóxi"
    },
    available: true
  },
  {
    id: "mesa-escritorio-l-executive",
    name: "Mesa de Escritório em L Executive",
    category: "Escritório",
    price: 1250.00,
    installments: "10x de R$ 125,00",
    image: "https://picsum.photos/seed/office-desk/800/600",
    description: "Mesa ergonômica com amplo espaço de trabalho e calhas para fiação.",
    specs: {
      dimensions: "160cm x 160cm x 75cm",
      weight: "42kg",
      material: "MDP 25mm",
      finish: "Amadeirado com Preto"
    },
    available: true
  },
  {
    id: "fogao-industrial-6-bocas",
    name: "Fogão Industrial 6 Bocas com Forno",
    category: "Gastronomia",
    price: 2100.00,
    installments: "10x de R$ 210,00",
    image: "https://picsum.photos/seed/stove1/800/600",
    description: "Fogão de alta pressão ideal para cozinhas de grande demanda.",
    specs: {
      dimensions: "120cm x 85cm x 80cm",
      weight: "85kg",
      material: "Ferro Fundido e Aço Carbono",
      finish: "Pintura Eletrostática"
    },
    available: true
  }
];

export const CATEGORIES = ["Todos", "Gastronomia", "Refrigeração", "Escritório", "Cozinha Industrial"];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Como escolher o sofá ideal para sua sala",
    date: "20/02/2026",
    category: "Dicas de Decoração",
    excerpt: "Confira as principais dicas para não errar na hora de comprar seu novo sofá.",
    image: "https://picsum.photos/seed/blog1/400/300"
  },
  {
    id: 2,
    title: "Tendências de móveis para 2026",
    date: "15/02/2026",
    category: "Tendências",
    excerpt: "O que há de mais moderno no mundo do design de interiores para este ano.",
    image: "https://picsum.photos/seed/blog2/400/300"
  }
];
