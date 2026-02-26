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

export const PRODUCTS: Product[] = [
  // Padarias
  {
    id: "forno-turbo-pratica",
    name: "Forno Turbo Digital",
    category: "Padarias",
    brand: "Prática",
    price: 12500.00,
    installments: "10x de R$ 1.250,00",
    image: "https://picsum.photos/seed/bakery1/800/600",
    description: "Forno turbo de alta performance para panificação profissional. Tecnologia digital de ponta.",
    specs: {
      dimensions: "100cm x 130cm x 170cm",
      weight: "210kg",
      material: "Aço Inox",
      finish: "Escovado"
    },
    available: true
  },
  {
    id: "amassadeira-gpaniz",
    name: "Amassadeira Espiral",
    category: "Padarias",
    brand: "G.Paniz",
    price: 8900.00,
    installments: "10x de R$ 890,00",
    image: "https://picsum.photos/seed/bakery2/800/600",
    description: "Amassadeira industrial para massas pesadas. Silenciosa e extremamente resistente.",
    specs: {
      dimensions: "60cm x 90cm x 110cm",
      weight: "120kg",
      material: "Ferro Fundido e Inox",
      finish: "Pintura Epóxi"
    },
    available: true
  },

  // Restaurantes
  {
    id: "fogao-industrial-6-bocas",
    name: "Fogão Industrial 6 Bocas",
    category: "Restaurantes",
    brand: "Tron",
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
    id: "fritadeira-eletrica-tedesco",
    name: "Fritadeira Elétrica Água e Óleo",
    category: "Restaurantes",
    brand: "Tedesco",
    price: 2100.00,
    installments: "10x de R$ 210,00",
    image: "https://picsum.photos/seed/fryer1/800/600",
    description: "Fritadeira de alto rendimento com sistema de filtragem água e óleo.",
    specs: {
      dimensions: "50cm x 50cm x 110cm",
      weight: "25kg",
      material: "Aço Inox",
      finish: "Polido"
    },
    available: true
  },

  // Açougues
  {
    id: "moedor-beccaro",
    name: "Moedor de Carne Industrial",
    category: "Açougues",
    brand: "Beccaro",
    price: 3800.00,
    installments: "10x de R$ 380,00",
    image: "https://picsum.photos/seed/butcher1/800/600",
    description: "Moedor de carne potente em aço inox. Higiênico e de fácil manutenção.",
    specs: {
      dimensions: "40cm x 60cm x 50cm",
      weight: "35kg",
      material: "Aço Inox 304",
      finish: "Polido"
    },
    available: true
  },
  {
    id: "serra-fita-metvisa",
    name: "Serra Fita para Ossos",
    category: "Açougues",
    brand: "Metvisa",
    price: 5200.00,
    installments: "10x de R$ 520,00",
    image: "https://picsum.photos/seed/butcher2/800/600",
    description: "Serra fita robusta para cortes precisos de carnes com ossos.",
    specs: {
      dimensions: "70cm x 80cm x 160cm",
      weight: "90kg",
      material: "Aço Inox e Alumínio",
      finish: "Pintura Epóxi"
    },
    available: true
  },

  // Supermercados
  {
    id: "checkout-innal",
    name: "Check-out com Esteira",
    category: "Supermercados",
    brand: "Innal",
    price: 4200.00,
    installments: "10x de R$ 420,00",
    image: "https://picsum.photos/seed/market1/800/600",
    description: "Balcão de caixa ergonômico com esteira automática.",
    specs: {
      dimensions: "200cm x 100cm x 90cm",
      weight: "110kg",
      material: "Aço e Borracha",
      finish: "Pintura Eletrostática"
    },
    available: true
  },
  {
    id: "expositor-esmaltec",
    name: "Expositor Vertical Frios",
    category: "Supermercados",
    brand: "Esmaltec",
    price: 5900.00,
    installments: "10x de R$ 590,00",
    image: "https://picsum.photos/seed/market4/800/600",
    description: "Expositor refrigerado para laticínios e embutidos.",
    specs: {
      dimensions: "120cm x 70cm x 200cm",
      weight: "140kg",
      material: "Aço Pré-pintado",
      finish: "Branco"
    },
    available: true
  },

  // Lanchonetes
  {
    id: "chapa-bifeteira-metalcubas",
    name: "Chapa Bifeteira a Gás",
    category: "Lanchonetes",
    brand: "Metalcubas",
    price: 1250.00,
    installments: "5x de R$ 250,00",
    image: "https://picsum.photos/seed/snack1/800/600",
    description: "Chapa profissional para lanches com espessura ideal para retenção de calor.",
    specs: {
      dimensions: "80cm x 50cm x 20cm",
      weight: "22kg",
      material: "Aço Carbono e Inox",
      finish: "Retificado"
    },
    available: true
  },
  {
    id: "refresqueira-venancio",
    name: "Refresqueira 2 Cubas",
    category: "Lanchonetes",
    brand: "Venâncio",
    price: 2850.00,
    installments: "10x de R$ 285,00",
    image: "https://picsum.photos/seed/snack2/800/600",
    description: "Refresqueira de alta capacidade para sucos e bebidas. Mantém a temperatura ideal.",
    specs: {
      dimensions: "40cm x 50cm x 70cm",
      weight: "18kg",
      material: "Inox e Policarbonato",
      finish: "Transparente"
    },
    available: true
  },

  // Móveis Para Escritório
  {
    id: "cadeira-presidente-ergon",
    name: "Cadeira Presidente Ergon",
    category: "Móveis Para Escritório",
    brand: "Frisokar",
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
    id: "mesa-escritorio-l",
    name: "Mesa de Escritório em L",
    category: "Móveis Para Escritório",
    brand: "Marelli",
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
