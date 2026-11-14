import type { StoreConfig } from '../types'

const opt = (name: string, labels: string[], soldOut: string[] = []) => ({
  name,
  values: labels.map((label) => ({ label, soldOut: soldOut.includes(label) })),
})
const colors = (...c: [string, string][]) => ({
  name: 'Cor',
  values: c.map(([label, swatch]) => ({ label, swatch })),
})

export const eletronicos: StoreConfig = {
  id: 'eletronicos',
  brand: {
    name: 'Circuito',
    tagline: 'Eletrônicos de lojas verificadas, com nota fiscal e garantia.',
    announcement: 'Nota fiscal em todos os pedidos · 10x sem juros · Frete grátis acima de R$ 499',
    // Trilha de circuito num chip arredondado.
    mark: (c) =>
      `<rect x="2" y="2" width="28" height="28" rx="7" fill="${c.accent}"/><g fill="none" stroke="${c.accentFg}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 22.5v-8l5-5h8"/><path d="M15.5 22.5h7"/></g><circle cx="22.5" cy="9.5" r="2.6" fill="${c.accentFg}"/><circle cx="9.5" cy="22.5" r="2.6" fill="${c.accentFg}"/>`,
  },
  theme: {
    colors: {
      bg: '#0e1012',
      surface: '#171a1d',
      fg: '#eef1f3',
      muted: '#8b939b',
      line: '#262b30',
      accent: '#d7ff3a',
      accentFg: '#0e1012',
      sale: '#ff7a59',
    },
    fonts: { display: "'Space Grotesk Variable', system-ui, sans-serif", body: "'Inter Tight Variable', system-ui, sans-serif" },
    radius: 8,
    scheme: 'dark',
  },
  locale: 'pt-BR',
  currency: 'BRL',
  hero: {
    eyebrow: 'Semana do áudio',
    title: 'Som sem fio, com cancelamento de ruído de verdade',
    body: 'Fones, caixas e soundbars de 120 lojas verificadas. Compare fichas técnicas lado a lado e compre de quem tem estoque.',
    cta: { label: 'Ver áudio', to: '/c/audio' },
    productId: 'e-01',
  },
  rails: [
    { title: 'Em alta', tag: 'alta' },
    { title: 'Ofertas do dia', onSale: true },
    { title: 'Para montar seu setup', categoryId: 'perifericos' },
  ],
  perks: [
    { title: 'Lojas verificadas', body: 'Todo vendedor passa por checagem de CNPJ e emite nota fiscal.' },
    { title: 'Garantia no site', body: 'Abra o chamado de garantia direto pelo pedido.' },
    { title: '10x sem juros', body: 'No cartão, ou 8% de desconto pagando no Pix.' },
  ],
  shipping: {
    freeOver: 499,
    methods: [
      { id: 'normal', label: 'Normal', days: '4 a 7 dias úteis', price: 24.9 },
      { id: 'rapida', label: 'Rápida', days: '1 a 2 dias úteis', price: 44.9 },
    ],
  },
  installments: 10,
  pixDiscount: 0.08,
  categories: [
    { id: 'audio', slug: 'audio', name: 'Áudio', blurb: 'Fones, caixas de som e soundbars.', tone: '#1f2a33' },
    { id: 'celulares', slug: 'celulares', name: 'Celulares', blurb: 'Smartphones novos e recondicionados.', tone: '#26222e' },
    { id: 'computadores', slug: 'computadores', name: 'Computadores', blurb: 'Notebooks, monitores e armazenamento.', tone: '#1e2b26' },
    { id: 'perifericos', slug: 'perifericos', name: 'Periféricos', blurb: 'Teclados, mouses e webcams.', tone: '#2e2a20' },
  ],
  sellers: [
    { id: 'byte-store', slug: 'byte-store', name: 'Byte Store', city: 'São Paulo, SP', since: 2014, rating: 4.8, sales: 48210, blurb: 'Distribuidor oficial de áudio e periféricos.', tone: '#1f2a33', logo: '/logos/byte-store.svg' },
    { id: 'recondicionados-sul', slug: 'recondicionados-sul', name: 'Recondicionados Sul', city: 'Curitiba, PR', since: 2018, rating: 4.6, sales: 12900, blurb: 'Celulares revisados com 12 meses de garantia.', tone: '#26222e', logo: '/logos/recondicionados-sul.svg' },
    { id: 'kernel-informatica', slug: 'kernel-informatica', name: 'Kernel Informática', city: 'Recife, PE', since: 2011, rating: 4.7, sales: 30550, blurb: 'Notebooks, montagem e upgrade de computadores.', tone: '#1e2b26', logo: '/logos/kernel-informatica.svg' },
  ],
  products: [
    {
      id: 'e-01', slug: 'fone-anc-pulse-x', images: ['fone-anc-pulse-x'], name: 'Fone Pulse X com cancelamento de ruído', categoryId: 'audio', sellerId: 'byte-store',
      price: 1299, compareAt: 1599, rating: 4.8, reviews: 2140, stock: 34, freeShipping: true, badge: 'Mais vendido', tone: '#2a3540',
      description: 'Fone over-ear com cancelamento de ruído adaptativo, 40 h de bateria e modo ambiente. Dobra e cabe no estojo rígido.',
      highlights: ['Cancelamento de ruído adaptativo', '40 h de bateria', 'Carga rápida: 10 min = 5 h'],
      specs: { Conexão: 'Bluetooth 5.4, P2', Bateria: 'Até 40 h', Peso: '254 g', Codecs: 'AAC, LDAC', Garantia: '12 meses' },
      options: [colors(['Grafite', '#3a3d40'], ['Prata', '#c9ccd0'])],
      tags: ['alta'],
    },
    {
      id: 'e-02', slug: 'caixa-som-portatil-rock', images: ['caixa-som-portatil-rock'], name: 'Caixa de som portátil Rock 20', categoryId: 'audio', sellerId: 'byte-store',
      price: 549, rating: 4.6, reviews: 860, stock: 50, freeShipping: true, tone: '#203038',
      description: 'Resistente à água e poeira (IP67), 20 W de potência e pareamento com uma segunda caixa para som estéreo.',
      specs: { Potência: '20 W RMS', Proteção: 'IP67', Bateria: 'Até 16 h', Garantia: '12 meses' },
      options: [colors(['Preto', '#1d1f21'], ['Azul', '#2f4d6e'], ['Verde', '#3e5a45'])],
    },
    {
      id: 'e-03', slug: 'soundbar-arc-3-1', images: ['soundbar-arc-3-1'], name: 'Soundbar Arc 3.1 com subwoofer', categoryId: 'audio', sellerId: 'byte-store',
      price: 2199, compareAt: 2599, rating: 4.7, reviews: 312, stock: 7, freeShipping: true, tone: '#262c31',
      description: 'Canal central dedicado para diálogos, subwoofer sem fio e HDMI eARC.',
      specs: { Canais: '3.1', Potência: '400 W', Conexões: 'HDMI eARC, óptica, Bluetooth', Garantia: '12 meses' },
      tags: ['alta'],
    },
    {
      id: 'e-04', slug: 'fone-esportivo-run', images: ['fone-esportivo-run'], name: 'Fone esportivo Run', categoryId: 'audio', sellerId: 'byte-store',
      price: 349, rating: 4.4, reviews: 540, stock: 0, tone: '#2b3330',
      description: 'Intra-auricular com gancho, resistente ao suor e com controle por toque.',
      specs: { Proteção: 'IPX5', Bateria: '8 h (+24 h no estojo)', Garantia: '6 meses' },
      options: [colors(['Preto', '#1d1f21'], ['Laranja', '#d76a2c'])],
    },
    {
      id: 'e-05', slug: 'smartphone-nova-12', images: ['smartphone-nova-12'], name: 'Smartphone Nova 12', categoryId: 'celulares', sellerId: 'recondicionados-sul',
      price: 2899, compareAt: 3299, rating: 4.7, reviews: 1290, stock: 18, freeShipping: true, badge: 'Lançamento', tone: '#2d2836',
      description: 'Tela OLED de 6,4" a 120 Hz, câmera principal de 50 MP com estabilização óptica e 5 anos de atualizações.',
      highlights: ['Tela OLED 120 Hz', 'Câmera 50 MP com OIS', '5 anos de atualizações'],
      specs: { Tela: '6,4" OLED 120 Hz', Processador: 'Octa-core 3,0 GHz', Bateria: '4.700 mAh', Câmera: '50 + 12 MP', Garantia: '12 meses' },
      options: [opt('Armazenamento', ['128 GB', '256 GB', '512 GB'], ['512 GB']), colors(['Grafite', '#2e2f33'], ['Areia', '#d9cdb7'], ['Verde', '#4f6656'])],
      tags: ['alta'],
    },
    {
      id: 'e-06', slug: 'smartphone-lite-recondicionado', images: ['smartphone-lite-recondicionado'], name: 'Smartphone Lite 9 (recondicionado)', categoryId: 'celulares', sellerId: 'recondicionados-sul',
      price: 899, compareAt: 1399, rating: 4.5, reviews: 410, stock: 11, tone: '#2a2733',
      description: 'Aparelho revisado, bateria acima de 90% de saúde e 12 meses de garantia da loja.',
      specs: { Tela: '6,1" LCD', Bateria: 'Saúde acima de 90%', Estado: 'Excelente', Garantia: '12 meses' },
      options: [opt('Armazenamento', ['64 GB', '128 GB'])],
    },
    {
      id: 'e-07', slug: 'notebook-orbit-14', images: ['notebook-orbit-14'], name: 'Notebook Orbit 14', categoryId: 'computadores', sellerId: 'kernel-informatica',
      price: 5499, rating: 4.8, reviews: 288, stock: 6, freeShipping: true, tone: '#203029',
      description: 'Ultrafino de alumínio, 14" 2.8K, 16 GB de RAM e bateria para um dia inteiro.',
      highlights: ['Tela 2.8K de 14"', '1,3 kg', 'Até 15 h de bateria'],
      specs: { Processador: '12 núcleos', Memória: '16 GB LPDDR5', Tela: '14" 2.8K 90 Hz', Peso: '1,3 kg', Garantia: '12 meses' },
      options: [opt('Armazenamento', ['512 GB', '1 TB']), opt('Voltagem', ['Bivolt'])],
      tags: ['alta'],
    },
    {
      id: 'e-08', slug: 'monitor-27-qhd', images: ['monitor-27-qhd'], name: 'Monitor 27" QHD 165 Hz', categoryId: 'computadores', sellerId: 'kernel-informatica',
      price: 1799, compareAt: 2199, rating: 4.7, reviews: 640, stock: 21, freeShipping: true, tone: '#1d2a27',
      description: 'Painel IPS de 27", 2560 × 1440, 165 Hz e base com ajuste de altura.',
      specs: { Painel: 'IPS', Resolução: '2560 × 1440', Taxa: '165 Hz', Conexões: 'HDMI 2.0, DisplayPort 1.4', Garantia: '12 meses' },
    },
    {
      id: 'e-09', slug: 'ssd-nvme-1tb', images: ['ssd-nvme-1tb'], name: 'SSD NVMe 1 TB', categoryId: 'computadores', sellerId: 'kernel-informatica',
      price: 479, rating: 4.9, reviews: 1830, stock: 70, tone: '#22302b',
      description: 'Leitura de até 7.000 MB/s, formato M.2 2280 e dissipador opcional.',
      specs: { Interface: 'PCIe 4.0 ×4', Leitura: '7.000 MB/s', Gravação: '6.000 MB/s', Garantia: '5 anos' },
      options: [opt('Dissipador', ['Sem dissipador', 'Com dissipador'])],
    },
    {
      id: 'e-10', slug: 'teclado-mecanico-75', images: ['teclado-mecanico-75'], name: 'Teclado mecânico 75%', categoryId: 'perifericos', sellerId: 'byte-store',
      price: 629, rating: 4.8, reviews: 920, stock: 25, badge: 'Escolha da loja', tone: '#33302a',
      description: 'Layout 75% em alumínio, switches trocáveis sem solda, conexão com fio, Bluetooth e 2,4 GHz.',
      specs: { Layout: '75% ABNT2', Switches: 'Hot-swap', Conexão: 'USB-C, Bluetooth, 2,4 GHz', Garantia: '12 meses' },
      options: [opt('Switch', ['Linear', 'Tátil', 'Clicky'], ['Clicky']), colors(['Grafite', '#3a3a3a'], ['Branco', '#e8e8e4'])],
      tags: ['alta'],
    },
    {
      id: 'e-11', slug: 'mouse-sem-fio-glide', images: ['mouse-sem-fio-glide'], name: 'Mouse sem fio Glide', categoryId: 'perifericos', sellerId: 'byte-store',
      price: 299, compareAt: 379, rating: 4.6, reviews: 1120, stock: 44, tone: '#2e2b23',
      description: 'Sensor de 26.000 DPI, 63 g e bateria de 90 h.',
      specs: { Sensor: '26.000 DPI', Peso: '63 g', Bateria: '90 h', Garantia: '12 meses' },
      options: [colors(['Preto', '#1d1f21'], ['Branco', '#ecebe7'])],
    },
    {
      id: 'e-12', slug: 'webcam-4k-studio', images: ['webcam-4k-studio'], name: 'Webcam 4K Studio', categoryId: 'perifericos', sellerId: 'kernel-informatica',
      price: 749, rating: 4.5, reviews: 205, stock: 13, tone: '#2b2a26',
      description: 'Sensor 4K com HDR, foco automático e dois microfones com redução de ruído.',
      specs: { Resolução: '4K 30 fps / 1080p 60 fps', Campo: '90°', Conexão: 'USB-C', Garantia: '12 meses' },
    },
  ],
}
