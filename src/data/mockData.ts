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
    id: "fogao-industrial-6-bocas",
    name: "Fogão Industrial 6 Bocas",
    category: "Gastronomia",
    price: 3490.00,
    installments: "10x de R$ 349,00",
    image: "https://picsum.photos/seed/stove1/800/600",
    description: "Fogão industrial de alta potência com forno integrado. Ideal para restaurantes e cozinhas profissionais.",
    specs: {
      dimensions: "120cm x 80cm x 90cm",
      weight: "85kg",
      material: "Aço Inox Escovado",
      finish: "Grelhas em ferro fundido"
    },
    available: true
  },
  {
    id: "freezer-vertical-expositor",
    name: "Freezer Vertical Expositor",
    category: "Refrigeração",
    price: 4850.00,
    installments: "10x de R$ 485,00",
    image: "https://picsum.photos/seed/freezer1/800/600",
    description: "Freezer vertical com porta de vidro duplo e iluminação LED. Perfeito para bebidas e congelados.",
    specs: {
      dimensions: "70cm x 70cm x 190cm",
      weight: "95kg",
      material: "Aço Pré-pintado e Vidro Temperado",
      finish: "Pintura eletrostática"
    },
    available: true
  },
  {
    id: "cadeira-presidente-ergon",
    name: "Cadeira Presidente Ergon",
    category: "Escritório",
    price: 1290.00,
    installments: "10x de R$ 129,00",
    image: "https://picsum.photos/seed/chair1/800/600",
    description: "Cadeira ergonômica de alto padrão com diversos ajustes e revestimento em couro sintético.",
    specs: {
      dimensions: "70cm x 70cm x 120-130cm",
      weight: "18kg",
      material: "Base em Alumínio e Couro PU",
      finish: "Costura dupla"
    },
    available: true
  },
  {
    id: "estufa-salgados-curva",
    name: "Estufa para Salgados Curva",
    category: "Gastronomia",
    price: 850.00,
    installments: "5x de R$ 170,00",
    image: "https://picsum.photos/seed/display1/800/600",
    description: "Estufa elegante com vidro curvo para manter seus salgados sempre quentes e atrativos.",
    specs: {
      dimensions: "60cm x 45cm x 40cm",
      weight: "12kg",
      material: "Aço Inox e Vidro",
      finish: "Brilhante"
    },
    available: true
  },
  {
    id: "mesa-escritorio-l",
    name: "Mesa de Escritório em L",
    category: "Escritório",
    price: 950.00,
    installments: "10x de R$ 95,00",
    image: "https://picsum.photos/seed/desk1/800/600",
    description: "Mesa em L espaçosa para otimizar seu ambiente de trabalho. Design moderno e funcional.",
    specs: {
      dimensions: "150cm x 150cm x 75cm",
      weight: "35kg",
      material: "MDP 25mm",
      finish: "Melamínico"
    },
    available: true
  }
];

export const CATEGORIES = ["Todos", "Gastronomia", "Refrigeração", "Escritório", "Equipamentos"];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Como montar uma cozinha industrial eficiente",
    date: "20/02/2026",
    category: "Dicas Técnicas",
    excerpt: "Confira os equipamentos essenciais e como organizar o fluxo de trabalho na sua cozinha.",
    image: "https://picsum.photos/seed/blog1/400/300"
  },
  {
    id: 2,
    title: "A importância da manutenção preventiva em refrigeradores",
    date: "15/02/2026",
    category: "Manutenção",
    excerpt: "Saiba como prolongar a vida útil dos seus equipamentos de refrigeração e economizar energia.",
    image: "https://picsum.photos/seed/blog2/400/300"
  }
];
