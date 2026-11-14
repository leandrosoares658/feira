// Gera as variantes AVIF / WebP / JPG das fotos de produto.
// Entrada: assets/originals/<nome>.(jpg|png)  →  Saída: public/images/<nome>-<largura>.<ext>
// Todas são recortadas em 4:5 (o formato dos cards). Rode com: npm run images
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'assets/originals'
const OUT = 'public/images'
const WIDTHS = [480, 768] // manter igual a src/components/ProductImage.tsx
const RATIO = 5 / 4

await mkdir(OUT, { recursive: true })

for (const file of (await readdir(SRC)).sort()) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const name = path.parse(file).name
  const input = sharp(path.join(SRC, file))

  for (const w of WIDTHS) {
    const base = input.clone().resize({ width: w, height: Math.round(w * RATIO), fit: 'cover', position: 'centre' })
    const results = await Promise.all([
      base.clone().avif({ quality: 50, effort: 6 }).toFile(`${OUT}/${name}-${w}.avif`),
      base.clone().webp({ quality: 72, effort: 6 }).toFile(`${OUT}/${name}-${w}.webp`),
      base.clone().jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(`${OUT}/${name}-${w}.jpg`),
    ])
    console.log(`${name}-${w}:`, results.map((r) => `${r.format} ${(r.size / 1024).toFixed(0)}KB`).join(' · '))
  }
}
