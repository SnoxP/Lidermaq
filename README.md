# Lidermaq - Móveis e Design

Este é o site institucional e catálogo da Lidermaq, desenvolvido com React, Tailwind CSS e Framer Motion.

## Como Editar Conteúdos

### 1. Logo e Cores
- **Logo**: Substitua o ícone e texto no arquivo `src/components/Header.tsx`.
- **Cores**: Altere as variáveis de cor no arquivo `src/index.css` dentro do bloco `@theme`. A cor principal é `--color-accent`.

### 2. Produtos e Categorias
- Todos os produtos, categorias e posts do blog estão centralizados no arquivo `src/data/mockData.ts`.
- Para adicionar um novo produto, basta seguir a estrutura do objeto `PRODUCTS`.

### 3. WhatsApp e Contatos
- **Número do WhatsApp**: Altere a variável `phoneNumber` no arquivo `src/components/WhatsAppButton.tsx` e os links em `src/pages/Home.tsx` e `src/pages/ProductDetail.tsx`.
- **Endereço e Telefones**: Edite o arquivo `src/components/Footer.tsx` e `src/pages/Contact.tsx`.

### 4. Imagens
- As imagens atuais utilizam o serviço `picsum.photos` como placeholder. Para usar imagens reais, coloque-as na pasta `public/assets/` e atualize os caminhos no `mockData.ts`.

## Deploy na Vercel

1. Crie um repositório no GitHub e faça o push do código.
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Importe o projeto "Lidermaq".
4. A Vercel detectará automaticamente as configurações do Vite.
5. Clique em **Deploy**.

## SEO e Otimização
- As meta tags básicas estão configuradas. Para otimização avançada, considere usar `react-helmet-async`.
- Imagens estão com `loading="lazy"` para melhor performance.
