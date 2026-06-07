export const product = {
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre del producto',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Mantas',         value: 'mantas'         },
          { title: 'Accesorios',     value: 'accesorios'     },
          { title: 'Personalizados', value: 'personalizados' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'price',
      title: 'Precio (ej: $85.000 o "Consultar")',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'originalPrice',
      title: 'Precio original tachado (opcional — para descuentos)',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    },
    // IMAGEN PRINCIPAL (portada en la tarjeta del catálogo)
    {
      name: 'image',
      title: 'Imagen principal (portada)',
      type: 'image',
      options: { hotspot: true },
    },
    // GALERÍA ADICIONAL (aparece en el detalle del producto)
    {
      name: 'images',
      title: 'Galería de imágenes (detalle)',
      description: 'Agrega hasta 6 fotos adicionales que se verán en la página de detalle',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.max(6),
    },
    {
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Disponible', value: 'available' },
          { title: 'Nuevo',      value: 'new'       },
          { title: 'Agotado',    value: 'out'       },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
    },
    // DETALLES TÉCNICOS
    {
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'Ej: Hilo merino 100%, Lana natural colombiana',
    },
    {
      name: 'dimensions',
      title: 'Dimensiones / Talla',
      type: 'string',
      description: 'Ej: 130 × 170 cm, Talla única',
    },
    {
      name: 'deliveryTime',
      title: 'Tiempo de entrega',
      type: 'string',
      description: 'Ej: 3–5 días hábiles',
    },
    {
      name: 'careInstructions',
      title: 'Instrucciones de cuidado',
      type: 'string',
      description: 'Ej: Lavar a mano en agua fría',
    },
    // ORDEN en el catálogo
    {
      name: 'order',
      title: 'Orden de aparición (número menor = primero)',
      type: 'number',
      initialValue: 99,
    },
    // STOCK
    {
      name: 'stock',
      title: 'Unidades disponibles',
      type: 'number',
      description: 'Dejar vacío = stock ilimitado. Con 1–3 unidades se muestra "Últimas X unidades" en el sitio.',
      validation: Rule => Rule.min(0).integer(),
    },
  ],
  // Vista previa en el panel de Sanity
  preview: {
    select: {
      title:    'name',
      subtitle: 'price',
      media:    'image',
      status:   'status',
      stock:    'stock',
    },
    prepare({ title, subtitle, media, status, stock }) {
      const icons = { available: '🟢', new: '✨', out: '🔴' }
      const stockWarning = (stock !== null && stock !== undefined && stock <= 3 && stock > 0)
        ? ` ⚠️ ${stock} ud.`
        : ''
      return {
        title,
        subtitle: `${icons[status] || ''} ${subtitle}${stockWarning}`,
        media,
      }
    },
  },
}

// ═══════════════════════════════════════════════
// SCHEMA — RESEÑA / TESTIMONIO
// ═══════════════════════════════════════════════
export const testimonial = {
  name: 'testimonial',
  title: 'Reseña de clienta',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre de la clienta',
      type: 'string',
      description: 'Ej: Valentina M.',
      validation: Rule => Rule.required(),
    },
    {
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      description: 'Ej: Medellín',
    },
    {
      name: 'rating',
      title: 'Calificación (1 a 5 estrellas)',
      type: 'number',
      options: {
        list: [1, 2, 3, 4, 5],
        layout: 'radio',
      },
      initialValue: 5,
      validation: Rule => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Reseña',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().max(320),
    },
    {
      name: 'product',
      title: 'Producto que compró',
      type: 'string',
      description: 'Ej: Manta Personalizada (opcional, se muestra como etiqueta)',
    },
    {
      name: 'photo',
      title: 'Foto de la clienta (opcional)',
      type: 'image',
      description: 'Si no hay foto se muestra un avatar con las iniciales',
      options: { hotspot: true },
    },
    {
      name: 'visible',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: true,
      description: 'Desactiva para ocultar sin borrar',
    },
    {
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      initialValue: 99,
    },
  ],
  preview: {
    select: {
      title:    'name',
      subtitle: 'text',
      media:    'photo',
      rating:   'rating',
      visible:  'visible',
    },
    prepare({ title, subtitle, media, rating, visible }) {
      const stars = '★'.repeat(rating || 5)
      return {
        title:    `${visible === false ? '🔒 ' : ''}${title}`,
        subtitle: `${stars} — ${subtitle?.slice(0, 60)}…`,
        media,
      }
    },
  },
}
