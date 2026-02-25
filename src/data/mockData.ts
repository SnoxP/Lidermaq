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
    id: "sofa-confort-plus",
    name: "Sofá Confort Plus 3 Lugares",
    category: "Sofás",
    price: 2490.00,
    installments: "10x de R$ 249,00",
    image: "https://picsum.photos/seed/sofa1/800/600",
    description: "O Sofá Confort Plus combina elegância e conforto supremo. Ideal para salas de estar modernas.",
    specs: {
      dimensions: "220cm x 95cm x 90cm",
      weight: "45kg",
      material: "Madeira de reflorestamento e Tecido Suede",
      finish: "Costura reforçada"
    },
    available: true
  },
  {
    id: "mesa-jantar-imperial",
    name: "Mesa de Jantar Imperial",
    category: "Mesas",
    price: 1850.00,
    installments: "10x de R$ 185,00",
    image: "https://picsum.photos/seed/table1/800/600",
    description: "Mesa robusta com tampo de vidro temperado e base em madeira maciça.",
    specs: {
      dimensions: "160cm x 90cm x 75cm",
      weight: "38kg",
      material: "Madeira Maciça e Vidro",
      finish: "Verniz fosco"
    },
    available: true
  },
  {
    id: "cadeira-ergon-office",
    name: "Cadeira Ergon Office",
    category: "Cadeiras",
    price: 890.00,
    installments: "5x de R$ 178,00",
    image: "https://picsum.photos/seed/chair1/800/600",
    description: "Cadeira ergonômica para escritório com ajuste de altura e apoio lombar.",
    specs: {
      dimensions: "65cm x 65cm x 110-120cm",
      weight: "12kg",
      material: "Polímero e Tela Mesh",
      finish: "Preto fosco"
    },
    available: true
  },
  {
    id: "armario-multi-organizer",
    name: "Armário Multi Organizer",
    category: "Armários",
    price: 1200.00,
    installments: "10x de R$ 120,00",
    image: "https://picsum.photos/seed/closet1/800/600",
    description: "Armário versátil para diversos ambientes, com prateleiras ajustáveis.",
    specs: {
      dimensions: "80cm x 45cm x 180cm",
      weight: "30kg",
      material: "MDP 15mm",
      finish: "Pintura UV"
    },
    available: true
  },
  {
    id: "cama-box-dream",
    name: "Cama Box Dream Casal",
    category: "Dormitórios",
    price: 3200.00,
    installments: "12x de R$ 266,66",
    image: "https://picsum.photos/seed/bed1/800/600",
    description: "Cama box com molas ensacadas e camada extra de conforto.",
    specs: {
      dimensions: "138cm x 188cm x 65cm",
      weight: "55kg",
      material: "Molas Ensacadas e Espuma D33",
      finish: "Tecido Jacquard"
    },
    available: true
  }
];

export const CATEGORIES = ["Todos", "Sofás", "Mesas", "Cadeiras", "Dormitórios", "Armários"];

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
