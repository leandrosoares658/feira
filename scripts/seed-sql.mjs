// Gera supabase/seed.sql a partir dos presets em src/config/presets.
// Rode com: npm run db:seed  → depois cole o arquivo no SQL Editor do Supabase.
import { writeFile } from 'node:fs/promises'
import { moda } from '../src/config/presets/moda.ts'
import { eletronicos } from '../src/config/presets/eletronicos.ts'
import { variedades } from '../src/config/presets/variedades.ts'

const stores = [variedades, moda, eletronicos]

const lit = (v) => {
  if (v == null) return 'null'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (Array.isArray(v) && v.every((x) => typeof x === 'string')) return `array[${v.map(lit).join(', ')}]::text[]`
  if (typeof v === 'object') return `${lit(JSON.stringify(v))}::jsonb`
  return `'${String(v).replaceAll("'", "''")}'`
}

const insert = (table, rows) => {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const values = rows.map((r) => `  (${cols.map((c) => lit(r[c])).join(', ')})`).join(',\n')
  return `insert into public.${table} (${cols.join(', ')}) values\n${values};\n`
}

let sql = `-- Gerado por scripts/seed-sql.mjs — não edite à mão.
-- Rode DEPOIS do schema.sql. Pode rodar de novo: limpa o catálogo antes.
delete from public.products;
delete from public.sellers;
delete from public.categories;
delete from public.stores where id not in (select store_id from public.orders);

`

for (const s of stores) {
  sql += `-- ${s.brand.name} (${s.id})\n`
  sql += `insert into public.stores (id, name) values (${lit(s.id)}, ${lit(s.brand.name)}) on conflict (id) do update set name = excluded.name;\n`
  sql += insert('categories', s.categories.map((c, i) => ({ store_id: s.id, id: c.id, slug: c.slug, name: c.name, blurb: c.blurb, tone: c.tone, position: i })))
  sql += insert('sellers', s.sellers.map((x, i) => ({ store_id: s.id, id: x.id, slug: x.slug, name: x.name, city: x.city, since: x.since, rating: x.rating, sales: x.sales, blurb: x.blurb, tone: x.tone, position: i })))
  sql += insert(
    'products',
    s.products.map((p, i) => ({
      store_id: s.id,
      id: p.id,
      slug: p.slug,
      name: p.name,
      category_id: p.categoryId,
      seller_id: p.sellerId,
      price: p.price,
      compare_at: p.compareAt ?? null,
      rating: p.rating,
      reviews: p.reviews,
      stock: p.stock,
      free_shipping: p.freeShipping ?? false,
      badge: p.badge ?? null,
      description: p.description,
      highlights: p.highlights ?? null,
      specs: p.specs ?? null,
      options: p.options ?? null,
      images: p.images ?? null,
      tone: p.tone,
      tags: p.tags ?? null,
      position: i,
    })),
  )
  sql += '\n'
}

await writeFile('supabase/seed.sql', sql)
console.log(`supabase/seed.sql: ${stores.reduce((n, s) => n + s.products.length, 0)} produtos em ${stores.length} lojas`)
