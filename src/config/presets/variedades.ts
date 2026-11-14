import type { StoreConfig } from '../types'

const opt = (name: string, labels: string[], soldOut: string[] = []) => ({
  name,
  values: labels.map((label) => ({ label, soldOut: soldOut.includes(label) })),
})
const colors = (...c: [string, string][]) => ({
  name: 'Cor',
  values: c.map(([label, swatch]) => ({ label, swatch })),
})

export const variedades: StoreConfig = {
  id: 'variedades',
  brand: {
    name: 'Feira',
    tagline: 'Casa, cozinha, pet e papelaria de lojas do bairro para todo o Brasil.',
    announcement: 'Frete grátis acima de R$ 149 · Retire na loja mais perto de você',
    // Toldo de feira sobre a banca.
    mark: (c) =>
      `<path fill="${c.accent}" d="M4 7.5h24v4.2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path fill="${c.sale}" d="M7 3h18l3 4.5H4z"/><rect x="6.5" y="16.5" width="19" height="11" rx="2" fill="${c.fg}"/><rect x="12.5" y="20.5" width="7" height="7" rx="1" fill="${c.bg}"/>`,
  },
  theme: {
    colors: {
      bg: '#fbf7f0',
      surface: '#f2eadc',
      fg: '#22201c',
      muted: '#6e675c',
      line: '#e2d8c6',
      accent: '#1f5f4a',
      accentFg: '#fbf7f0',
      sale: '#d4472b',
    },
    fonts: { display: "'Bricolage Grotesque Variable', system-ui, sans-serif", body: "'DM Sans Variable', system-ui, sans-serif" },
    radius: 14,
    scheme: 'light',
  },
  locale: 'pt-BR',
  currency: 'BRL',
  hero: {
    eyebrow: 'Achados da semana',
    title: 'Tudo que a casa pede, de quem entende do assunto',
    body: 'Mais de 300 lojinhas independentes vendendo utilidades, plantas, ração, cadernos e o que mais faltar. Junte itens de lojas diferentes num carrinho só.',
    cta: { label: 'Ver ofertas', to: '/busca?oferta=1' },
    productId: 'v-01',
  },
  rails: [
    { title: 'Queridinhos da semana', tag: 'destaque' },
    { title: 'Com desconto', onSale: true },
    { title: 'Para o seu pet', categoryId: 'pet' },
  ],
  perks: [
    { title: 'Um carrinho, várias lojas', body: 'Compre de vendedores diferentes e pague tudo de uma vez.' },
    { title: 'Retirada no bairro', body: 'Escolha retirar na loja e receba no mesmo dia.' },
    { title: '3x sem juros', body: 'No cartão, ou 5% de desconto pagando no Pix.' },
  ],
  shipping: {
    freeOver: 149,
    methods: [
      { id: 'retirada', label: 'Retirar na loja', days: 'Pronto em 2 horas', price: 0 },
      { id: 'padrao', label: 'Entrega padrão', days: '3 a 5 dias úteis', price: 14.9 },
      { id: 'hoje', label: 'Entrega hoje', days: 'Pedidos até 14h', price: 24.9 },
    ],
  },
  installments: 3,
  pixDiscount: 0.05,
  categories: [
    { id: 'casa', slug: 'casa', name: 'Casa e cozinha', blurb: 'Utensílios, organização e mesa posta.', tone: '#f0d9b5' },
    { id: 'plantas', slug: 'plantas', name: 'Plantas e jardim', blurb: 'Mudas, vasos e o que mais elas pedirem.', tone: '#cfe0c3' },
    { id: 'pet', slug: 'pet', name: 'Pet', blurb: 'Ração, petiscos e brinquedos.', tone: '#f3cdb8' },
    { id: 'papelaria', slug: 'papelaria', name: 'Papelaria', blurb: 'Cadernos, canetas e escritório.', tone: '#d6d9ef' },
  ],
  sellers: [
    { id: 'emporio-da-vila', slug: 'emporio-da-vila', name: 'Empório da Vila', city: 'Porto Alegre, RS', since: 2012, rating: 4.8, sales: 15400, blurb: 'Utilidades domésticas e cozinha desde 1998 no bairro.', tone: '#f0d9b5', logo: '/logos/emporio-da-vila.svg' },
    { id: 'verde-quintal', slug: 'verde-quintal', name: 'Verde Quintal', city: 'Holambra, SP', since: 2017, rating: 4.9, sales: 8300, blurb: 'Viveiro familiar que envia mudas bem embaladas.', tone: '#cfe0c3', logo: '/logos/verde-quintal.svg' },
    { id: 'patas-e-cia', slug: 'patas-e-cia', name: 'Patas & Cia', city: 'Salvador, BA', since: 2015, rating: 4.7, sales: 21800, blurb: 'Pet shop com entrega rápida e marcas selecionadas.', tone: '#f3cdb8', logo: '/logos/patas-e-cia.svg' },
    { id: 'papel-carbono', slug: 'papel-carbono', name: 'Papel Carbono', city: 'Rio de Janeiro, RJ', since: 2020, rating: 4.8, sales: 6100, blurb: 'Papelaria autoral com cadernos costurados à mão.', tone: '#d6d9ef', logo: '/logos/papel-carbono.svg' },
  ],
  products: [
    {
      id: 'v-01', slug: 'panela-ferro-fundido', images: ['panela-ferro-fundido'], name: 'Panela de ferro fundido 24 cm', categoryId: 'casa', sellerId: 'emporio-da-vila',
      price: 289, compareAt: 349, rating: 4.9, reviews: 742, stock: 19, freeShipping: true, badge: 'Mais vendido', tone: '#e9cfa6',
      description: 'Ferro fundido esmaltado por dentro e por fora, vai do fogão ao forno e passa de geração em geração.',
      highlights: ['Serve fogão, forno e indução', 'Esmaltada, não precisa curar', 'Tampa com autorregagem'],
      specs: { Material: 'Ferro fundido esmaltado', Capacidade: '4,2 L', Diâmetro: '24 cm', Peso: '4,6 kg' },
      options: [colors(['Vermelho', '#b33a2b'], ['Verde', '#3f6b52'], ['Creme', '#ede3cf'])],
      tags: ['destaque'],
    },
    {
      id: 'v-02', slug: 'kit-potes-vidro', images: ['kit-potes-vidro'], name: 'Kit 5 potes de vidro com tampa', categoryId: 'casa', sellerId: 'emporio-da-vila',
      price: 129, rating: 4.7, reviews: 1205, stock: 80, tone: '#f1e2c8',
      description: 'Vidro borossilicato que vai ao micro-ondas e ao forno, com tampas herméticas de bambu.',
      specs: { Material: 'Vidro borossilicato e bambu', Capacidades: '350 ml a 1,5 L' },
    },
    {
      id: 'v-03', slug: 'jogo-toalhas-algodao', images: ['jogo-toalhas-algodao'], name: 'Jogo de toalhas de algodão', categoryId: 'casa', sellerId: 'emporio-da-vila',
      price: 159, compareAt: 199, rating: 4.6, reviews: 388, stock: 33, tone: '#efdcc0',
      description: 'Duas toalhas de banho e duas de rosto, fio penteado de 500 g/m².',
      specs: { Composição: '100% algodão', Gramatura: '500 g/m²', Peças: '4' },
      options: [colors(['Areia', '#d9c7a7'], ['Cinza', '#9a9a95'], ['Terracota', '#b9643f'])],
    },
    {
      id: 'v-04', slug: 'costela-de-adao', images: ['costela-de-adao'], name: 'Costela-de-adão em vaso 17', categoryId: 'plantas', sellerId: 'verde-quintal',
      price: 89, rating: 4.8, reviews: 512, stock: 24, badge: 'Fácil de cuidar', tone: '#c6dbb6',
      description: 'Muda com 40 a 50 cm, enviada no vaso plástico com substrato e guia de cuidados.',
      specs: { Altura: '40 a 50 cm', Luz: 'Meia-sombra', Rega: '2 vezes por semana', 'Pet friendly': 'Não' },
      options: [opt('Vaso', ['Sem cachepô', 'Cachepô de cerâmica', 'Cesto de fibra'])],
      tags: ['destaque'],
    },
    {
      id: 'v-05', slug: 'kit-temperos-horta', images: ['kit-temperos-horta'], name: 'Kit horta de temperos', categoryId: 'plantas', sellerId: 'verde-quintal',
      price: 74, compareAt: 99, rating: 4.6, reviews: 230, stock: 41, tone: '#d4e4c4',
      description: 'Quatro mudas (manjericão, alecrim, salsinha e cebolinha) com floreira de 50 cm.',
      specs: { Itens: '4 mudas + floreira', Luz: 'Sol pleno' },
    },
    {
      id: 'v-06', slug: 'regador-metal', images: ['regador-metal'], name: 'Regador de metal 1,5 L', categoryId: 'plantas', sellerId: 'verde-quintal',
      price: 69, rating: 4.7, reviews: 96, stock: 0, tone: '#cbd9c0',
      description: 'Bico longo para chegar ao fundo dos vasos sem molhar as folhas.',
      options: [colors(['Verde', '#5b7b5f'], ['Cobre', '#b07a4f'])],
    },
    {
      id: 'v-07', slug: 'racao-natural-caes', images: ['racao-natural-caes'], name: 'Ração natural para cães adultos', categoryId: 'pet', sellerId: 'patas-e-cia',
      price: 189, compareAt: 219, rating: 4.8, reviews: 1630, stock: 52, freeShipping: true, tone: '#efc6ad',
      description: 'Sem corantes nem transgênicos, com frango como primeiro ingrediente.',
      highlights: ['Frango é o primeiro ingrediente', 'Sem corantes artificiais'],
      specs: { Indicação: 'Cães adultos', 'Proteína bruta': '26%', Origem: 'Brasil' },
      options: [opt('Peso', ['2,5 kg', '10,1 kg', '15 kg'], ['15 kg'])],
      tags: ['destaque'],
    },
    {
      id: 'v-08', slug: 'arranhador-torre-gato', images: ['arranhador-torre-gato'], name: 'Arranhador torre para gatos', categoryId: 'pet', sellerId: 'patas-e-cia',
      price: 249, rating: 4.7, reviews: 318, stock: 12, tone: '#f1d1bf',
      description: 'Três andares, toca acolchoada e postes revestidos de sisal natural.',
      specs: { Altura: '92 cm', Base: '40 × 40 cm', Material: 'MDF, sisal e pelúcia' },
      options: [colors(['Bege', '#d7c3a5'], ['Cinza', '#8f8f8a'])],
    },
    {
      id: 'v-09', slug: 'petisco-dental', images: ['petisco-dental'], name: 'Petisco dental (pacote com 7)', categoryId: 'pet', sellerId: 'patas-e-cia',
      price: 39.9, rating: 4.5, reviews: 870, stock: 120, tone: '#f4d7c4',
      description: 'Formato que ajuda a reduzir o tártaro, um por dia.',
      options: [opt('Porte', ['Pequeno', 'Médio', 'Grande'])],
    },
    {
      id: 'v-10', slug: 'caderno-costurado-a5', images: ['caderno-costurado-a5'], name: 'Caderno costurado A5', categoryId: 'papelaria', sellerId: 'papel-carbono',
      price: 64, rating: 4.9, reviews: 452, stock: 38, badge: 'Feito à mão', tone: '#d9dcf0',
      description: 'Capa dura em tecido, 160 páginas de papel pólen 90 g e abertura de 180°.',
      specs: { Formato: 'A5 (14,8 × 21 cm)', Páginas: '160', Papel: 'Pólen 90 g/m²' },
      options: [opt('Miolo', ['Pautado', 'Pontilhado', 'Liso']), colors(['Azul', '#3c4f7a'], ['Mostarda', '#c9a03a'], ['Vinho', '#6e2b33'])],
      tags: ['destaque'],
    },
    {
      id: 'v-11', slug: 'kit-canetas-gel', images: ['kit-canetas-gel'], name: 'Kit 12 canetas gel 0,5', categoryId: 'papelaria', sellerId: 'papel-carbono',
      price: 49.9, compareAt: 64.9, rating: 4.6, reviews: 690, stock: 95, tone: '#dfe1f2',
      description: 'Doze cores com tinta de secagem rápida e ponta de 0,5 mm.',
      specs: { Ponta: '0,5 mm', Cores: '12' },
    },
    {
      id: 'v-12', slug: 'organizador-mesa-bambu', images: ['organizador-mesa-bambu'], name: 'Organizador de mesa de bambu', categoryId: 'papelaria', sellerId: 'emporio-da-vila',
      price: 99, rating: 4.7, reviews: 144, stock: 20, tone: '#e5dcc5',
      description: 'Cinco compartimentos e uma gaveta para canetas, clipes e celular.',
      specs: { Material: 'Bambu', Dimensões: '30 × 18 × 12 cm' },
    },
  ],
}
