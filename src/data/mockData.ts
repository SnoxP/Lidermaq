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
  // Padaria
  {
    id: "forno-turbo-pratica",
    name: "Forno Turbo Digital",
    category: "Padaria",
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
    category: "Padaria",
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
  {
    id: "divisora-venancio",
    name: "Divisora de Massa Manual",
    category: "Padaria",
    brand: "Venâncio",
    price: 3200.00,
    installments: "10x de R$ 320,00",
    image: "https://picsum.photos/seed/bakery3/800/600",
    description: "Divisora de massa precisa para padronização de pães. Fácil operação e limpeza.",
    specs: {
      dimensions: "50cm x 50cm x 150cm",
      weight: "65kg",
      material: "Aço Carbono",
      finish: "Pintura Eletrostática"
    },
    available: true
  },
  {
    id: "modeladora-gastromaq",
    name: "Modeladora de Pães",
    category: "Padaria",
    brand: "Gastromaq",
    price: 4500.00,
    installments: "10x de R$ 450,00",
    image: "https://picsum.photos/seed/bakery4/800/600",
    description: "Modeladora profissional para diversos tipos de pães. Alta produtividade.",
    specs: {
      dimensions: "60cm x 70cm x 120cm",
      weight: "80kg",
      material: "Aço Inox e Nylon",
      finish: "Polido"
    },
    available: true
  },
  {
    id: "fatiadora-braesi",
    name: "Fatiadora de Pão de Forma",
    category: "Padaria",
    brand: "Braesi",
    price: 2800.00,
    installments: "10x de R$ 280,00",
    image: "https://picsum.photos/seed/bakery5/800/600",
    description: "Fatiadora rápida e segura para pães de forma e similares.",
    specs: {
      dimensions: "50cm x 60cm x 70cm",
      weight: "45kg",
      material: "Aço Inox",
      finish: "Escovado"
    },
    available: true
  },

  // Açougue
  {
    id: "moedor-beccaro",
    name: "Moedor de Carne Industrial",
    category: "Açougue",
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
    category: "Açougue",
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
  {
    id: "amaciador-skymsen",
    name: "Amaciador de Carne",
    category: "Açougue",
    brand: "Skymsen",
    price: 2400.00,
    installments: "10x de R$ 240,00",
    image: "https://picsum.photos/seed/butcher3/800/600",
    description: "Amaciador de bifes profissional. Garante maciez e uniformidade.",
    specs: {
      dimensions: "30cm x 40cm x 45cm",
      weight: "15kg",
      material: "Aço Inox",
      finish: "Escovado"
    },
    available: true
  },
  {
    id: "balanca-toledo",
    name: "Balança Computadora Digital",
    category: "Açougue",
    brand: "Toledo",
    price: 1850.00,
    installments: "10x de R$ 185,00",
    image: "https://picsum.photos/seed/butcher4/800/600",
    description: "Balança de alta precisão com cálculo de preço e etiqueta.",
    specs: {
      dimensions: "40cm x 40cm x 15cm",
      weight: "8kg",
      material: "Plástico ABS e Inox",
      finish: "Fosco"
    },
    available: true
  },
  {
    id: "ensacadeira-picelli",
    name: "Ensacadeira de Linguiça",
    category: "Açougue",
    brand: "Picelli",
    price: 1200.00,
    installments: "5x de R$ 240,00",
    image: "https://picsum.photos/seed/butcher5/800/600",
    description: "Ensacadeira manual em aço inox para produção artesanal.",
    specs: {
      dimensions: "25cm x 25cm x 60cm",
      weight: "10kg",
      material: "Aço Inox",
      finish: "Polido"
    },
    available: true
  },

  // Supermercado
  {
    id: "checkout-innal",
    name: "Check-out com Esteira",
    category: "Supermercado",
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
    id: "gondola-amapa",
    name: "Gôndola Central Reforçada",
    category: "Supermercado",
    brand: "Amapá",
    price: 950.00,
    installments: "5x de R$ 190,00",
    image: "https://picsum.photos/seed/market2/800/600",
    description: "Gôndola de aço para exposição de produtos pesados.",
    specs: {
      dimensions: "100cm x 80cm x 170cm",
      weight: "40kg",
      material: "Aço Carbono",
      finish: "Pintura Epóxi"
    },
    available: true
  },
  {
    id: "carrinho-atila",
    name: "Carrinho de Compras 150L",
    category: "Supermercado",
    brand: "Metalúrgica Átila",
    price: 480.00,
    installments: "3x de R$ 160,00",
    image: "https://picsum.photos/seed/market3/800/600",
    description: "Carrinho de compras aramado com rodas de alta resistência.",
    specs: {
      dimensions: "60cm x 90cm x 100cm",
      weight: "18kg",
      material: "Aço Zincado",
      finish: "Zincagem Brilhante"
    },
    available: true
  },
  {
    id: "expositor-esmaltec",
    name: "Expositor Vertical Frios",
    category: "Supermercado",
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
  {
    id: "cortador-filizola",
    name: "Cortador de Frios Automático",
    category: "Supermercado",
    brand: "Filizola",
    price: 3600.00,
    installments: "10x de R$ 360,00",
    image: "https://picsum.photos/seed/market5/800/600",
    description: "Cortador de frios de alta precisão com lâmina de 300mm.",
    specs: {
      dimensions: "50cm x 60cm x 50cm",
      weight: "32kg",
      material: "Alumínio Anodizado",
      finish: "Anodizado"
    },
    available: true
  }
];

export const CATEGORIES = ["Todos", "Padaria", "Açougue", "Supermercado"];

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
