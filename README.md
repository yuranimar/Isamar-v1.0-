# Isamar — Guía Completa de Despliegue

> **Tejidos Artesanales** · React 19 · Vite · Tailwind CSS · Sanity.io · Vercel

---

## Índice

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Instalación local](#2-instalación-local)
3. [Configurar Sanity CMS](#3-configurar-sanity-cms)
4. [Generar imágenes de iconos](#4-generar-imágenes-de-iconos)
5. [Desplegar en Vercel](#5-desplegar-en-vercel)
6. [Configurar Google Search Console](#6-configurar-google-search-console)
7. [Variables de entorno](#7-variables-de-entorno)
8. [Checklist pre-lanzamiento](#8-checklist-pre-lanzamiento)
9. [Guía para Isamar: gestionar productos](#9-guía-para-isamar-gestionar-productos)
10. [Paleta de colores](#10-paleta-de-colores)

---

## 1. Estructura del proyecto

```
isamar/
├── public/
│   ├── favicon.svg              ← Sello IS (listo)
│   ├── og-image.svg             ← Imagen Open Graph en SVG
│   ├── og-image.jpg             ← Imagen OG para WhatsApp (generar con npm run og)
│   ├── site.webmanifest         ← PWA manifest
│   ├── robots.txt               ← Instrucciones para Google
│   └── sitemap.xml              ← Mapa del sitio
├── scripts/
│   └── generate-og-image.mjs   ← Convierte og-image.svg → jpg/png
├── sanity/
│   └── schema.js                ← Esquemas de Sanity (productos + reseñas)
├── src/
│   ├── components/              ← Navbar, Hero, Catalog, About, Testimonials,
│   │                               FaqShipping, Footer, ProductCard,
│   │                               ProductDetailModal, CartDrawer,
│   │                               WhatsAppFloat, IsamarLogo
│   ├── context/
│   │   └── CartContext.jsx      ← Estado global del carrito
│   ├── hooks/
│   │   ├── useProducts.js       ← Fetch productos de Sanity
│   │   ├── useTestimonials.js   ← Fetch reseñas de Sanity
│   │   └── useDocumentTitle.js  ← SEO dinámico por producto
│   ├── lib/
│   │   ├── sanity.js            ← Cliente Sanity + queries GROQ
│   │   ├── stockInfo.js         ← Lógica de urgencia de stock
│   │   └── whatsapp.js          ← Motor de mensajes WhatsApp inteligentes
│   └── index.css                ← Tailwind + estilos globales
├── vercel.json                  ← Configuración de despliegue
├── .env.example                 ← Variables de entorno (copiar a .env)
└── index.html                   ← SEO completo: OG, Twitter Card, Schema.org
```

---

## 2. Instalación local

```bash
# Clonar o descomprimir el proyecto
cd isamar

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus valores reales (ver sección 7)

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

---

## 3. Configurar Sanity CMS

### 3.1 Crear cuenta y proyecto

1. Ve a **[sanity.io](https://sanity.io)** → "Start for free"
2. Inicia sesión con Google o GitHub
3. Crea un nuevo proyecto: `npm create sanity@latest`
   - Nombre del proyecto: **Isamar**
   - Dataset: **production**
   - Template: **Clean project**
4. Anota el **Project ID** que aparece al final (ej: `abc123de`)

### 3.2 Agregar el esquema de productos

En la carpeta de tu proyecto Sanity (la que `create sanity` generó):

1. Abre `schemaTypes/index.js`
2. Copia el contenido de `sanity/schema.js` de este proyecto
3. Registra los tipos:

```js
// schemaTypes/index.js
import { product } from './product'
import { testimonial } from './testimonial'

export const schemaTypes = [product, testimonial]
```

### 3.3 Abrir el panel de administración

```bash
cd tu-proyecto-sanity
npm run dev
# → http://localhost:3333
```

Desde aquí Isamar puede gestionar todo sin tocar código.

### 3.4 Configurar CORS en Sanity

Para que el sitio web pueda leer los datos:

1. Ve a **[sanity.io/manage](https://sanity.io/manage)**
2. Selecciona tu proyecto → **API** → **CORS Origins**
3. Agrega: `https://isamar.co` (y `http://localhost:5173` para desarrollo)

---

## 4. Generar imágenes de iconos

WhatsApp requiere JPG/PNG para la imagen OG (no soporta SVG).

```bash
# Instalar sharp (solo una vez)
npm install -D sharp

# Generar og-image.jpg, apple-touch-icon.png y favicon-32.png
npm run og
```

Los archivos se generan en `/public/`. Súbelos junto con el resto del proyecto.

---

## 5. Desplegar en Vercel

### Opción A: Desde GitHub (recomendada — actualizaciones automáticas)

1. Sube el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Isamar v1.0 🧶"
   git remote add origin https://github.com/tuusuario/isamar.git
   git push -u origin main
   ```

2. Ve a **[vercel.com](https://vercel.com)** → "Add New Project"
3. Importa el repositorio de GitHub
4. Vercel detecta Vite automáticamente
5. En **Environment Variables** agrega (ver sección 7):
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET`
   - `VITE_WHATSAPP_NUMBER`
6. Clic en **Deploy** ✓

Cada vez que hagas `git push`, Vercel redespliega automáticamente en segundos.

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar (primera vez guía interactiva)
vercel

# Agregar variables de entorno
vercel env add VITE_SANITY_PROJECT_ID
vercel env add VITE_SANITY_DATASET
vercel env add VITE_WHATSAPP_NUMBER

# Desplegar a producción
vercel --prod
```

### Configurar dominio personalizado

1. En el dashboard de Vercel → tu proyecto → **Settings** → **Domains**
2. Agrega: `isamar.co` (o el dominio que tengas)
3. Vercel te da los DNS records para configurar en tu registrador
4. El SSL (HTTPS) se activa automáticamente ✓

---

## 6. Configurar Google Search Console

### 6.1 Verificar el sitio

1. Ve a **[search.google.com/search-console](https://search.google.com/search-console)**
2. Clic en **Agregar propiedad** → tipo **Dominio** → escribe `isamar.co`
3. Google te da un archivo HTML de verificación (ej: `google-abc123.html`)
4. Renombra `/public/google-XXXXXXXXXXXXXXXX.html` con ese nombre exacto
5. Redespliega el sitio
6. Vuelve a Search Console → **Verificar** ✓

### 6.2 Enviar el sitemap

1. En Search Console → **Sitemaps** (menú izquierdo)
2. Escribe: `sitemap.xml`
3. Clic en **Enviar** ✓

Google tardará 1–2 semanas en indexar el sitio.

### 6.3 Agregar meta de verificación al HTML (alternativa)

Si prefieres no subir el archivo HTML, en `index.html` agrega:

```html
<meta name="google-site-verification" content="TU_CÓDIGO_AQUÍ" />
```

---

## 7. Variables de entorno

### Archivo `.env` (local — nunca subir a Git)

```bash
# CMS
VITE_SANITY_PROJECT_ID=abc123de        # Tu Project ID de sanity.io/manage
VITE_SANITY_DATASET=production

# WhatsApp — número sin + ni espacios
VITE_WHATSAPP_NUMBER=573215551234      # Tu número real de WhatsApp
```

### En Vercel (producción)

Ir a: Vercel Dashboard → Proyecto → Settings → Environment Variables

| Variable                   | Valor                  | Entorno     |
|----------------------------|------------------------|-------------|
| `VITE_SANITY_PROJECT_ID`   | Tu Project ID          | Production  |
| `VITE_SANITY_DATASET`      | `production`           | Production  |
| `VITE_WHATSAPP_NUMBER`     | `573215551234`         | Production  |

> **Importante:** las variables con prefijo `VITE_` se exponen al navegador.
> Nunca pongas aquí tokens secretos, contraseñas ni API keys privadas.

---

## 8. Checklist pre-lanzamiento

Antes de compartir el link con clientes:

### Contenido
- [ ] Subir el logo real (`public/logo.png`) y actualizar `IsamarLogo.jsx` si se prefiere PNG
- [ ] Agregar al menos 6 productos reales en Sanity con fotos de alta calidad
- [ ] Agregar 3–5 reseñas reales de clientas en Sanity
- [ ] Revisar y ajustar los precios de envío en `FaqShipping.jsx`
- [ ] Actualizar el número de WhatsApp real en `.env` y en Vercel

### SEO y redes
- [ ] Cambiar `https://isamar.co` por la URL real en `index.html`, `sitemap.xml` y `vercel.json`
- [ ] Cambiar `@isamar` por el usuario real de Instagram en `index.html` (schema.org)
- [ ] Ejecutar `npm run og` y subir `og-image.jpg` a `/public/`
- [ ] Verificar preview de WhatsApp en [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug)
- [ ] Enviar sitemap a Google Search Console

### Técnico
- [ ] Probar en iPhone (Safari) y Android (Chrome)
- [ ] Verificar que el botón de WhatsApp abre el número correcto
- [ ] Probar el carrito: agregar productos → pedir por WhatsApp
- [ ] Revisar Google PageSpeed Insights: [pagespeed.web.dev](https://pagespeed.web.dev)

---

## 9. Guía para Isamar: gestionar productos

### Agregar un nuevo producto

1. Abre **[tu-proyecto.sanity.studio](https://tu-proyecto.sanity.studio)**
2. Clic en **Producto** (menú izquierdo) → **+ Nuevo**
3. Rellena los campos:
   - **Nombre**: "Manta Invierno Dorado"
   - **Categoría**: Mantas / Accesorios / Personalizados
   - **Precio**: "$95.000" (o "Consultar" para personalizados)
   - **Imagen principal**: sube la foto de portada
   - **Galería**: sube fotos adicionales (máx. 6)
   - **Estado**: Disponible / Nuevo / Agotado
   - **Unidades disponibles**: 2 (si quedan pocas, aparece "Últimas 2 unidades")
   - **Material, Dimensiones, Tiempo de entrega, Cuidados**: estos salen en el detalle
4. Clic en **Publicar** → aparece en el sitio en segundos ✓

### Marcar como agotado

Abre el producto → cambia **Estado** a **Agotado** → Publicar.
Las clientas verán el formulario "Avísame cuando llegue".

### Agregar una reseña

1. Clic en **Reseña de clienta** → **+ Nueva**
2. Nombre, ciudad, calificación (⭐⭐⭐⭐⭐), texto y foto (opcional)
3. Publicar → aparece en el carrusel de testimonios ✓

---

## 10. Paleta de colores

| Color              | Hex        | Uso                              |
|--------------------|------------|----------------------------------|
| Borgoña Profundo   | `#5B0E1B`  | Textos principales, botones      |
| Oro / Champán      | `#D4AF37`  | CTAs, bordes, acentos            |
| Rosa Pálido        | `#F5E6E6`  | Fondos suaves, fondos de imagen  |
| Marrón Texturizado | `#3D2E23`  | Textos secundarios               |
| Crema              | `#FAF6F3`  | Fondo principal                  |

---

*Hecho con ♥ para Isamar — Tejidos Artesanales*
#   I s a m a r - v 1 . 0 -  
 