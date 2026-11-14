/**
 * Contrato de uma loja. Tudo que muda de um segmento para outro (moda, eletrônicos,
 * variedades, pet, livraria…) vive aqui — o código das páginas não conhece o segmento.
 */

export type Theme = {
  /** Cores em hex. `accent` é a cor de ação (botões, links ativos). */
  colors: {
    bg: string
    surface: string
    fg: string
    muted: string
    line: string
    accent: string
    accentFg: string
    sale: string
  }
  fonts: {
    display: string
    body: string
  }
  /** Raio base dos cantos, em px. 0 = visual editorial; 12+ = visual amigável. */
  radius: number
  /** "dark" ajusta barras de rolagem e campos nativos do navegador. */
  scheme: 'light' | 'dark'
}

export type OptionValue = {
  label: string
  /** Cor da amostra (para opções do tipo cor). */
  swatch?: string
  /** Valor sem estoque — aparece riscado. */
  soldOut?: boolean
}

/** Uma dimensão de variação: Tamanho, Cor, Armazenamento, Voltagem, Sabor… */
export type ProductOption = {
  name: string
  values: OptionValue[]
}

export type Product = {
  id: string
  slug: string
  name: string
  categoryId: string
  sellerId: string
  price: number
  /** Preço "de" — quando presente, o produto aparece em oferta. */
  compareAt?: number
  rating: number
  reviews: number
  /** Unidades em estoque. 0 = esgotado. */
  stock: number
  freeShipping?: boolean
  badge?: string
  description: string
  /** Lista curta de destaques exibida perto do botão de compra. */
  highlights?: string[]
  /** Ficha técnica — chave/valor livre (Material, Tela, Peso…). */
  specs?: Record<string, string>
  options?: ProductOption[]
  /** Nomes de imagens geradas por `npm run images` (ex.: "camiseta-01"). */
  images?: string[]
  /** Cor de fundo do card quando não há imagem. */
  tone: string
  tags?: string[]
}

export type Category = {
  id: string
  slug: string
  name: string
  blurb: string
  tone: string
}

export type Seller = {
  id: string
  slug: string
  name: string
  city: string
  since: number
  rating: number
  sales: number
  blurb: string
  tone: string
  /** Caminho do logo (SVG/PNG). Sem logo, mostra a inicial no tom da loja. */
  logo?: string
}

export type ShippingMethod = {
  id: string
  label: string
  days: string
  price: number
}

export type StoreConfig = {
  id: string
  brand: {
    name: string
    tagline: string
    /** Texto curto da faixa no topo do site. */
    announcement: string
    /**
     * Símbolo da marca: conteúdo SVG num quadro de 32×32, recebendo as cores do tema.
     * Aparece ao lado do nome e vira o ícone da aba do navegador.
     */
    mark?: (c: Theme['colors']) => string
  }
  theme: Theme
  locale: string
  currency: string
  hero: {
    eyebrow: string
    title: string
    body: string
    cta: { label: string; to: string }
    /** Produto exibido na vitrine do hero. */
    productId: string
  }
  /** Seções de vitrine da home, montadas a partir de tags ou categorias. */
  rails: { title: string; tag?: string; categoryId?: string; onSale?: boolean }[]
  /** Promessas da loja (frete, troca, pagamento). */
  perks: { title: string; body: string }[]
  shipping: {
    freeOver: number
    methods: ShippingMethod[]
  }
  /** Até quantas parcelas sem juros. */
  installments: number
  /** Desconto no Pix, em fração (0.05 = 5%). */
  pixDiscount: number
  categories: Category[]
  sellers: Seller[]
  products: Product[]
}
