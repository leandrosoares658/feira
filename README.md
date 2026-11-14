# Marketplace

Marketplace multi-vendedor em React. O mesmo código atende qualquer segmento
(moda, eletrônicos, variedades, pet, livraria…) — tudo que é específico da loja
fica em um arquivo de configuração.

## Rodar

```bash
npm install
npm run dev
```

## Trocar de loja

Três lojas de exemplo vêm prontas em `src/config/presets/`:

| Preset        | Loja     | Visual                                  |
| ------------- | -------- | --------------------------------------- |
| `variedades`  | Feira    | claro, cantos arredondados (padrão)     |
| `moda`        | Vesta    | editorial, serifa, cantos retos         |
| `eletronicos` | Circuito | escuro, grotesca, destaque em verde-limão |

- **No build:** `VITE_STORE_PRESET=moda npm run build`
- **Na URL:** `?loja=moda` (fica salvo na sessão do navegador)

## Criar uma loja nova

Copie um preset, renomeie e registre em `src/config/index.ts`. O contrato está
em `src/config/types.ts`:

- `brand`, `hero`, `perks` — textos
- `theme` — cores, fontes, raio dos cantos, claro/escuro
- `categories`, `sellers`, `products` — catálogo
- `options` de cada produto — qualquer variação (Tamanho, Cor, Armazenamento,
  Voltagem, Peso…). **Os filtros do catálogo são gerados a partir delas**, sem
  configuração extra.
- `specs` — ficha técnica livre (chave/valor)
- `shipping`, `installments`, `pixDiscount` — regras comerciais

Fontes novas: instale com `npm i @fontsource-variable/<nome>` e importe em
`src/main.tsx`.

## Fotos dos produtos

Sem foto, cada produto aparece como um painel tipográfico no tom definido em
`tone`. Para usar fotos:

1. Coloque os originais em `assets/originals/` (ex.: `vestido-linho-1.jpg`).
2. Rode `npm run images` — gera AVIF, WebP e JPG em `public/images/`.
3. No produto: `images: ['vestido-linho-1', 'vestido-linho-2']`.

## O que tem

Home com vitrines, catálogo com busca, filtros e ordenação (tudo na URL),
página de produto com variações e cálculo de frete, páginas de loja,
favoritos, carrinho agrupado por vendedor e checkout simulado (Pix, cartão,
boleto). Carrinho e favoritos ficam salvos no navegador, separados por loja.

## Logos

- **Marca da loja:** `brand.mark` no preset é o conteúdo de um SVG 32×32 que recebe as
  cores do tema. Aparece ao lado do nome e vira o ícone da aba do navegador.
- **Vendedores:** arquivos em `public/logos/<id-do-vendedor>.svg`, ligados pelo campo
  `logo` do vendedor. Sem logo, aparece a inicial no tom do vendedor.

## Banco de dados (Supabase, opcional)

Sem configuração, o site usa os dados dos presets. Com o Supabase, o catálogo
vem do banco e os pedidos do checkout são gravados de verdade. Se o banco não
responder em 3,5 s (ex.: projeto pausado no plano grátis), o site volta sozinho
para os dados locais.

1. Crie `.env.local` na raiz:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
2. No Supabase, em **SQL Editor**, rode `supabase/schema.sql` e depois `supabase/seed.sql`.
3. Mudou produtos nos presets? Rode `npm run db:seed` e execute o novo `seed.sql`.

O catálogo é somente leitura para visitantes (RLS). Pedidos só entram pela
função `place_order`, que recalcula os preços no banco e confere o estoque.
Dados de cartão nunca são enviados.

## Deploy

`netlify.toml` já inclui o redirecionamento de SPA. Para usar o banco em
produção, cadastre as duas variáveis `VITE_SUPABASE_*` em
**Site configuration → Environment variables** no Netlify.
