import type { StoreConfig } from '../types'

const P = 'Tamanho'
const sizes = (out: string[] = []) => ({
  name: P,
  values: ['PP', 'P', 'M', 'G', 'GG'].map((label) => ({ label, soldOut: out.includes(label) })),
})
const colors = (...c: [string, string][]) => ({
  name: 'Cor',
  values: c.map(([label, swatch]) => ({ label, swatch })),
})

export const moda: StoreConfig = {
  id: 'moda',
  brand: {
    name: 'Vesta',
    tagline: 'Roupas de marcas independentes, num só lugar.',
    announcement: 'Troca grátis em até 30 dias · Frete grátis acima de R$ 299',
    // Cabide em traço fino.
    mark: (c) =>
      `<g fill="none" stroke="${c.fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.3 8.4a2.7 2.7 0 1 1 3.9 2.4c-.8.4-1.2 1-1.2 1.9v.9"/><path d="M16 13.6 4.6 21.8c-1 .7-.5 2.2.7 2.2h21.4c1.2 0 1.7-1.5.7-2.2z"/></g>`,
  },
  theme: {
    colors: {
      bg: '#f4f1ec',
      surface: '#ebe6de',
      fg: '#1a1816',
      muted: '#6f6a63',
      line: '#d9d3c9',
      accent: '#1a1816',
      accentFg: '#f4f1ec',
      sale: '#a3392b',
    },
    fonts: { display: "'Fraunces Variable', Georgia, serif", body: "'Inter Tight Variable', system-ui, sans-serif" },
    radius: 0,
    scheme: 'light',
  },
  locale: 'pt-BR',
  currency: 'BRL',
  hero: {
    eyebrow: 'Coleção Outono',
    title: 'Peças que atravessam estações',
    body: 'Linho, lã fria e algodão orgânico de 40 ateliês brasileiros. Feito em pequenos lotes, vendido direto por quem costura.',
    cta: { label: 'Ver a coleção', to: '/c/feminino' },
    productId: 'm-01',
  },
  rails: [
    { title: 'Novidades da semana', tag: 'novo' },
    { title: 'Em oferta', onSale: true },
    { title: 'Acessórios', categoryId: 'acessorios' },
  ],
  perks: [
    { title: 'Troca sem custo', body: '30 dias para trocar, com etiqueta de devolução gerada no site.' },
    { title: 'Direto do ateliê', body: 'Cada peça é vendida pela marca que a produziu.' },
    { title: '6x sem juros', body: 'No cartão, ou 5% de desconto pagando no Pix.' },
  ],
  shipping: {
    freeOver: 299,
    methods: [
      { id: 'pac', label: 'Econômica', days: '6 a 9 dias úteis', price: 19.9 },
      { id: 'sedex', label: 'Expressa', days: '2 a 3 dias úteis', price: 34.9 },
    ],
  },
  installments: 6,
  pixDiscount: 0.05,
  categories: [
    { id: 'feminino', slug: 'feminino', name: 'Feminino', blurb: 'Vestidos, camisas e alfaiataria leve.', tone: '#d8c8b4' },
    { id: 'masculino', slug: 'masculino', name: 'Masculino', blurb: 'Básicos bem cortados e peças de camada.', tone: '#b9bfae' },
    { id: 'calcados', slug: 'calcados', name: 'Calçados', blurb: 'Couro curtido ao vegetal e solados costurados.', tone: '#c9a98c' },
    { id: 'acessorios', slug: 'acessorios', name: 'Acessórios', blurb: 'Bolsas, cintos e lenços.', tone: '#cfc3a6' },
  ],
  sellers: [
    { id: 'atelie-ipe', slug: 'atelie-ipe', name: 'Ateliê Ipê', city: 'Belo Horizonte, MG', since: 2016, rating: 4.9, sales: 3820, blurb: 'Linho e algodão orgânico, cortados e costurados em BH.', tone: '#d8c8b4', logo: '/logos/atelie-ipe.svg' },
    { id: 'casa-tecelagem', slug: 'casa-tecelagem', name: 'Casa Tecelagem', city: 'Blumenau, SC', since: 2009, rating: 4.7, sales: 9140, blurb: 'Malharia familiar de terceira geração.', tone: '#b9bfae', logo: '/logos/casa-tecelagem.svg' },
    { id: 'sola-viva', slug: 'sola-viva', name: 'Sola Viva', city: 'Franca, SP', since: 2019, rating: 4.8, sales: 2210, blurb: 'Calçados e couro feitos à mão no polo de Franca.', tone: '#c9a98c', logo: '/logos/sola-viva.svg' },
  ],
  products: [
    {
      id: 'm-01', slug: 'vestido-midi-linho', images: ['vestido-midi-linho'], name: 'Vestido midi de linho', categoryId: 'feminino', sellerId: 'atelie-ipe',
      price: 389, rating: 4.8, reviews: 126, stock: 14, freeShipping: true, badge: 'Mais vendido', tone: '#d9cbb8',
      description: 'Vestido de alças largas em linho puro lavado, com caimento solto e bolsos laterais. Amassa do jeito certo.',
      highlights: ['100% linho europeu', 'Bolsos laterais', 'Lavar à mão ou ciclo delicado'],
      specs: { Composição: '100% linho', Modelagem: 'Ampla', Comprimento: 'Midi (118 cm no M)', Origem: 'Belo Horizonte, MG' },
      options: [colors(['Areia', '#d6c3a5'], ['Oliva', '#7a7a52'], ['Preto', '#1f1d1b']), sizes(['PP'])],
      tags: ['novo'],
    },
    {
      id: 'm-02', slug: 'camisa-oversized-algodao', images: ['camisa-oversized-algodao'], name: 'Camisa oversized de algodão', categoryId: 'feminino', sellerId: 'atelie-ipe',
      price: 249, compareAt: 319, rating: 4.6, reviews: 88, stock: 22, tone: '#e4ddd1',
      description: 'Camisa de botões com ombro caído e barra arredondada, em tricoline de algodão orgânico.',
      highlights: ['Algodão orgânico certificado', 'Botões de corozo'],
      specs: { Composição: '100% algodão orgânico', Modelagem: 'Oversized', Origem: 'Belo Horizonte, MG' },
      options: [colors(['Branco', '#f4f2ec'], ['Azul listrado', '#8ea3bd']), sizes()],
    },
    {
      id: 'm-03', slug: 'calca-pantalona-la-fria', images: ['calca-pantalona-la-fria'], name: 'Calça pantalona de lã fria', categoryId: 'feminino', sellerId: 'casa-tecelagem',
      price: 329, rating: 4.7, reviews: 54, stock: 9, tone: '#b9ad9c',
      description: 'Cintura alta com pregas, perna ampla e tecido que não marca. Para trabalhar e para sair.',
      specs: { Composição: '70% lã, 30% poliéster', Modelagem: 'Pantalona', Fechamento: 'Zíper invisível' },
      options: [colors(['Caramelo', '#a9805a'], ['Grafite', '#4a4a4a']), sizes(['GG'])],
      tags: ['novo'],
    },
    {
      id: 'm-04', slug: 'tricot-gola-alta', images: ['tricot-gola-alta'], name: 'Tricô gola alta', categoryId: 'feminino', sellerId: 'casa-tecelagem',
      price: 279, compareAt: 349, rating: 4.9, reviews: 203, stock: 3, badge: 'Últimas peças', tone: '#c7b9a3',
      description: 'Tricô canelado de toque macio, com gola dobrável e punhos longos.',
      specs: { Composição: '60% algodão, 40% acrílico', Modelagem: 'Justa' },
      options: [colors(['Cru', '#e8e0cf'], ['Vinho', '#6b2a2f']), sizes(['PP', 'P'])],
    },
    {
      id: 'm-05', slug: 'camiseta-pesada-masculina', images: ['camiseta-pesada-masculina'], name: 'Camiseta peso pesado', categoryId: 'masculino', sellerId: 'casa-tecelagem',
      price: 119, rating: 4.7, reviews: 412, stock: 60, tone: '#c9c6bd',
      description: 'Malha de 240 g/m² que não deforma na lavagem, gola reforçada e costura dupla.',
      highlights: ['Malha 240 g/m²', 'Pré-encolhida'],
      specs: { Composição: '100% algodão', Gramatura: '240 g/m²', Modelagem: 'Regular' },
      options: [colors(['Off-white', '#efece4'], ['Preto', '#1f1d1b'], ['Musgo', '#5b6143']), sizes()],
      tags: ['novo'],
    },
    {
      id: 'm-06', slug: 'jaqueta-trucker-sarja', images: ['jaqueta-trucker-sarja'], name: 'Jaqueta trucker de sarja', categoryId: 'masculino', sellerId: 'atelie-ipe',
      price: 459, rating: 4.8, reviews: 71, stock: 12, freeShipping: true, tone: '#a8a58d',
      description: 'Sarja de algodão encorpada, bolsos de peito com lapela e botões de metal envelhecido.',
      specs: { Composição: '100% algodão', Forro: 'Sem forro', Modelagem: 'Regular' },
      options: [colors(['Oliva', '#6e6c4a'], ['Areia', '#c8b893']), sizes(['PP'])],
    },
    {
      id: 'm-07', slug: 'bermuda-chino', images: ['bermuda-chino'], name: 'Bermuda chino', categoryId: 'masculino', sellerId: 'casa-tecelagem',
      price: 159, compareAt: 199, rating: 4.5, reviews: 96, stock: 31, tone: '#cdbf9f',
      description: 'Sarja leve com elastano, comprimento acima do joelho e barra italiana.',
      specs: { Composição: '98% algodão, 2% elastano', Comprimento: '20 cm de entreperna' },
      options: [colors(['Cáqui', '#bba77d'], ['Marinho', '#2d3a4f']), sizes()],
    },
    {
      id: 'm-08', slug: 'mocassim-couro', images: ['mocassim-couro'], name: 'Mocassim de couro', categoryId: 'calcados', sellerId: 'sola-viva',
      price: 429, rating: 4.9, reviews: 64, stock: 8, freeShipping: true, badge: 'Feito à mão', tone: '#a5826a',
      description: 'Couro curtido ao vegetal com costura à mão e sola de couro com taco de borracha.',
      highlights: ['Couro curtido ao vegetal', 'Sola costurada (pode ser trocada)'],
      specs: { Cabedal: 'Couro bovino', Solado: 'Couro com taco de borracha', Origem: 'Franca, SP' },
      options: [colors(['Conhaque', '#8a5a3c'], ['Café', '#4a3326']), { name: 'Número', values: ['37', '38', '39', '40', '41', '42', '43'].map((label) => ({ label, soldOut: label === '43' })) }],
      tags: ['novo'],
    },
    {
      id: 'm-09', slug: 'tenis-lona', images: ['tenis-lona'], name: 'Tênis de lona', categoryId: 'calcados', sellerId: 'sola-viva',
      price: 229, compareAt: 289, rating: 4.6, reviews: 158, stock: 27, tone: '#d5d0c3',
      description: 'Lona de algodão, palmilha de látex natural e sola vulcanizada.',
      specs: { Cabedal: 'Lona de algodão', Solado: 'Borracha vulcanizada' },
      options: [colors(['Cru', '#e6dfcf'], ['Preto', '#232323']), { name: 'Número', values: ['34', '35', '36', '37', '38', '39', '40', '41', '42'].map((label) => ({ label })) }],
    },
    {
      id: 'm-10', slug: 'bolsa-tote-couro', images: ['bolsa-tote-couro'], name: 'Bolsa tote de couro', categoryId: 'acessorios', sellerId: 'sola-viva',
      price: 549, rating: 4.9, reviews: 39, stock: 5, freeShipping: true, tone: '#b48d6c',
      description: 'Tote estruturada com bolso interno com zíper e alças que cabem no ombro.',
      specs: { Material: 'Couro bovino', Dimensões: '38 × 32 × 12 cm', Forro: 'Algodão' },
      options: [colors(['Caramelo', '#a0714b'], ['Preto', '#1f1d1b'])],
    },
    {
      id: 'm-11', slug: 'cinto-couro-fivela', images: ['cinto-couro-fivela'], name: 'Cinto de couro', categoryId: 'acessorios', sellerId: 'sola-viva',
      price: 139, compareAt: 169, rating: 4.7, reviews: 77, stock: 40, tone: '#8d6a50',
      description: 'Couro inteiriço de 3,5 cm com fivela de latão maciço.',
      specs: { Largura: '3,5 cm', Fivela: 'Latão maciço' },
      options: [{ name: 'Tamanho', values: ['85', '90', '95', '100', '105'].map((label) => ({ label })) }],
    },
    {
      id: 'm-12', slug: 'lenco-seda-estampado', images: ['lenco-seda-estampado'], name: 'Lenço de seda estampado', categoryId: 'acessorios', sellerId: 'atelie-ipe',
      price: 189, rating: 4.8, reviews: 22, stock: 15, tone: '#d4b9a0',
      description: 'Seda pura com estampa desenhada no ateliê e barra feita à mão.',
      specs: { Material: '100% seda', Dimensões: '70 × 70 cm' },
      options: [colors(['Terracota', '#b5643f'], ['Azul', '#4c6a8c'])],
      tags: ['novo'],
    },
  ],
}
