#!/usr/bin/env node
/**
 * generate-og-image.mjs
 * Convierte og-image.svg → og-image.jpg (1200×630) para WhatsApp y redes sociales.
 *
 * WhatsApp NO soporta SVG como imagen OG — necesita JPG o PNG.
 *
 * Uso:
 *   node scripts/generate-og-image.mjs
 *
 * Requiere: npm install -D sharp
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

async function main() {
  try {
    const sharp = (await import('sharp')).default
    const svgBuffer = readFileSync(join(publicDir, 'og-image.svg'))

    await sharp(svgBuffer)
      .resize(1200, 630)
      .jpeg({ quality: 90, progressive: true })
      .toFile(join(publicDir, 'og-image.jpg'))

    console.log('✅ og-image.jpg generado en /public')

    // También generar apple-touch-icon 180×180
    const faviconSvg = readFileSync(join(publicDir, 'favicon.svg'))
    await sharp(faviconSvg)
      .resize(180, 180)
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'))

    console.log('✅ apple-touch-icon.png generado en /public')

    // favicon-32.png
    await sharp(faviconSvg)
      .resize(32, 32)
      .png()
      .toFile(join(publicDir, 'favicon-32.png'))

    console.log('✅ favicon-32.png generado en /public')

  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message?.includes("Cannot find package 'sharp'")) {
      console.log('⚠️  Instala sharp primero: npm install -D sharp')
      console.log('   Luego ejecuta: node scripts/generate-og-image.mjs')
    } else {
      console.error('Error:', err.message)
    }
  }
}

main()
