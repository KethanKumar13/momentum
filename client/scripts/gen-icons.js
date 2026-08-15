/**
 * Regenerates PWA icons + apple-touch-icon from public/logo.svg.
 * Requires: npm install --save-dev sharp
 * Run: node scripts/gen-icons.js
 */

import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const iconsDir = path.join(publicDir, 'icons')
const logoBuffer = readFileSync(path.join(publicDir, 'logo.svg'))
const BG = { r: 0x08, g: 0x09, b: 0x0D, alpha: 1 }

mkdirSync(iconsDir, { recursive: true })

async function render(size, output, { padding = 0 } = {}) {
  const inner = size - padding * 2

  const layer = await sharp(logoBuffer)
    .resize(inner, inner)
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: layer, top: padding, left: padding }])
    .png()
    .toFile(output)

  console.log(`✓ ${path.relative(publicDir, output)}`)
}

await render(192, path.join(iconsDir, 'icon-192.png'))
await render(512, path.join(iconsDir, 'icon-512.png'))
await render(512, path.join(iconsDir, 'icon-512-maskable.png'), {
  padding: 64,
})
await render(180, path.join(publicDir, 'apple-touch-icon.png'))

console.log('\nAll icons regenerated from public/logo.svg')
