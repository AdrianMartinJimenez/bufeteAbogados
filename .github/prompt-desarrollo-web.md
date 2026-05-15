# Prompt de Desarrollo Web — Despacho de Abogados

> **Stack:** Astro 5.x · TypeScript · Tailwind CSS · Sanity.io · React (islands)
> **Estilo:** Minimalista, corporativo, tipografía serif + sans, blanco/negro/dorado
> **Panel de control:** Sanity Studio embebido en `/studio`

---

## CONTEXTO DEL PROYECTO

Desarrolla una web corporativa completa para un despacho de abogados especializado en reestructuraciones e insolvencias, derecho mercantil, penal económico y derecho del arte. El diseño debe ser **minimalista de alto nivel**, inspirado en referentes como keplerkarst.com o loewe.com: mucho espacio en blanco, tipografía dominante, animaciones sutiles y ausencia de decoración superflua.

Todo el contenido editable (menús, secciones de home, servicios, sectores, equipo, blog, prensa) se gestionará desde **Sanity Studio**. La página de contacto tendrá datos fijos en el código.

---

## STACK TECNOLÓGICO

```json
{
  "framework": "Astro 5.x",
  "language": "TypeScript",
  "styling": "Tailwind CSS 4.x",
  "cms": "Sanity.io (v3 Studio)",
  "interactive_components": "React 18 (Astro islands)",
  "animations": "Motion One (ex @motionone/dom)",
  "forms": "React Hook Form + Zod",
  "email": "Resend (API route en Astro SSR)",
  "images": "Astro Image component + Sanity image pipeline",
  "search": "Pagefind (static search)",
  "deployment": "Vercel (SSR mode)",
  "package_manager": "pnpm"
}
```

### Dependencias principales

```bash
pnpm create astro@latest -- --template minimal
pnpm add @astrojs/react @astrojs/tailwind @astrojs/sanity @astrojs/vercel
pnpm add @sanity/client @sanity/image-url sanity
pnpm add react react-dom react-hook-form zod
pnpm add @motionone/dom
pnpm add resend
pnpm add -D tailwindcss @tailwindcss/typography prettier prettier-plugin-astro
```

---

## ESTRUCTURA DE ARCHIVOS

```
/
├── public/
│   ├── fonts/               # Cormorant Garamond (serif), Inter (sans)
│   └── images/
│       └── placeholder/     # Imágenes de ejemplo (ver sección de datos de muestra)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Navigation.astro
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── AboutSection.astro
│   │   │   ├── ServicesHighlight.astro
│   │   │   ├── SectorsHighlight.astro
│   │   │   ├── TeamHighlight.astro
│   │   │   ├── KnowledgeHighlight.astro
│   │   │   ├── BadgesSection.astro
│   │   │   └── CtaSection.astro
│   │   ├── ui/
│   │   │   ├── ServiceCard.astro
│   │   │   ├── SectorCard.astro
│   │   │   ├── TeamCard.astro
│   │   │   ├── ArticleCard.astro
│   │   │   ├── PortableText.astro
│   │   │   └── SanityImage.astro
│   │   └── interactive/
│   │       ├── MobileMenu.tsx
│   │       ├── ContactForm.tsx
│   │       └── SearchOverlay.tsx
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   └── ArticleLayout.astro
│   ├── lib/
│   │   ├── sanity.ts          # Cliente Sanity
│   │   ├── queries.ts         # Todas las queries GROQ
│   │   ├── portableText.ts    # Configuración PortableText
│   │   └── utils.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── servicios/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── sectores/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── equipo/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── conocimiento/
│   │   │   ├── index.astro
│   │   │   ├── [slug].astro
│   │   │   └── [...page].astro
│   │   ├── prensa/
│   │   │   ├── index.astro
│   │   │   ├── [slug].astro
│   │   │   └── [...page].astro
│   │   ├── contacto.astro
│   │   ├── politica-privacidad.astro
│   │   ├── aviso-legal.astro
│   │   ├── politica-cookies.astro
│   │   └── api/
│   │       └── contact.ts     # API route para formulario
│   └── styles/
│       └── global.css
├── sanity/
│   ├── sanity.config.ts
│   ├── schemas/
│   │   ├── index.ts
│   │   ├── documents/
│   │   │   ├── servicio.ts
│   │   │   ├── sector.ts
│   │   │   ├── miembro.ts
│   │   │   ├── articulo.ts
│   │   │   ├── noticia.ts
│   │   │   └── configuracion.ts  # Singleton
│   │   └── objects/
│   │       ├── seoFields.ts
│   │       ├── oficina.ts
│   │       └── badge.ts
│   └── lib/
│       └── imageBuilder.ts
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

---

## DISEÑO Y ESTILOS

### Paleta de colores

```css
/* tailwind.config.mjs */
colors: {
  firm: {
    black:   '#0A0A0A',   /* fondo oscuro, textos principales */
    white:   '#F8F7F4',   /* blanco cálido para fondos */
    gold:    '#C9A84C',   /* acento dorado, hover states */
    muted:   '#6B6B6B',   /* textos secundarios */
    border:  '#E2E0DB',   /* bordes, separadores */
  }
}
```

### Tipografía

```css
/* Importar en global.css */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

/* Variables */
--font-serif: 'Cormorant Garamond', Georgia, serif;   /* headings, hero */
--font-sans:  'Inter', system-ui, sans-serif;          /* body, navegación */
```

### Principios de diseño minimalista

- Padding generoso: mínimo `py-24` en secciones
- Grid máximo de 12 columnas con max-width `1400px`
- Bordes de `1px` en firm-border, nunca sombras por defecto
- Animaciones solo en `opacity` y `transform` (no en color ni tamaño)
- Sin íconos de relleno — solo líneas o tipografía
- Hover: subrayado animated con `scaleX` o color gold
- Las imágenes usan `grayscale` por defecto, `grayscale-0` en hover

---

## SANITY STUDIO — SCHEMAS COMPLETOS

### `sanity/schemas/documents/configuracion.ts` (Singleton global)

```typescript
// Documento único que controla toda la configuración del sitio
// Acceso: /studio → "Configuración del Sitio"
export default defineType({
  name: 'configuracion',
  title: 'Configuración del Sitio',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // Solo actualizar, no crear/eliminar
  fields: [
    // ── IDENTIDAD ──
    defineField({ name: 'nombreSitio', title: 'Nombre del despacho', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo (claro)', type: 'image' }),
    defineField({ name: 'logoOscuro', title: 'Logo (oscuro)', type: 'image' }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),

    // ── HOME: HERO ──
    defineField({ name: 'heroTitulo', title: 'Hero — Título principal', type: 'string',
      description: 'Ej: BRAVE ADVOCACY' }),
    defineField({ name: 'heroSubtitulos', title: 'Hero — Subtítulos rotativos', type: 'array',
      of: [{ type: 'string' }] }),
    defineField({ name: 'heroDescripcion', title: 'Hero — Descripción', type: 'text' }),
    defineField({ name: 'heroCtaTexto', title: 'Hero — Texto del botón CTA', type: 'string' }),
    defineField({ name: 'heroCtaEnlace', title: 'Hero — Enlace del botón CTA', type: 'string' }),
    defineField({ name: 'heroImagen', title: 'Hero — Imagen de fondo', type: 'image',
      options: { hotspot: true } }),

    // ── HOME: SOBRE NOSOTROS ──
    defineField({ name: 'sobreTitulo', title: 'Sobre Nosotros — Título', type: 'string' }),
    defineField({ name: 'sobreContenido', title: 'Sobre Nosotros — Contenido', type: 'array',
      of: [{ type: 'block' }] }),
    defineField({ name: 'sobreImagen', title: 'Sobre Nosotros — Imagen', type: 'image',
      options: { hotspot: true } }),
    defineField({ name: 'sobreCtaTexto', title: 'Sobre Nosotros — Texto CTA', type: 'string' }),
    defineField({ name: 'sobreCtaEnlace', title: 'Sobre Nosotros — Enlace CTA', type: 'string' }),

    // ── HOME: SERVICIOS DESTACADOS ──
    defineField({ name: 'serviciosTitulo', title: 'Sección Servicios — Título', type: 'string' }),
    defineField({ name: 'serviciosDestacados', title: 'Servicios a mostrar en Home',
      type: 'array', of: [{ type: 'reference', to: [{ type: 'servicio' }] }],
      validation: Rule => Rule.max(6) }),

    // ── HOME: SECTORES DESTACADOS ──
    defineField({ name: 'sectoresTitulo', title: 'Sección Sectores — Título', type: 'string' }),
    defineField({ name: 'sectoresDestacados', title: 'Sectores a mostrar en Home',
      type: 'array', of: [{ type: 'reference', to: [{ type: 'sector' }] }],
      validation: Rule => Rule.max(6) }),

    // ── HOME: EQUIPO DESTACADO ──
    defineField({ name: 'equipoTitulo', title: 'Sección Equipo — Título', type: 'string' }),
    defineField({ name: 'equipoDestacado', title: 'Miembros a mostrar en Home',
      type: 'array', of: [{ type: 'reference', to: [{ type: 'miembro' }] }],
      validation: Rule => Rule.max(4) }),

    // ── HOME: RECONOCIMIENTOS ──
    defineField({ name: 'reconocimientosTitulo', title: 'Reconocimientos — Título', type: 'string' }),
    defineField({ name: 'badges', title: 'Badges / Rankings', type: 'array',
      of: [{
        type: 'object', fields: [
          { name: 'imagen', type: 'image', title: 'Imagen del badge' },
          { name: 'titulo', type: 'string', title: 'Título' },
          { name: 'enlace', type: 'url', title: 'Enlace externo (opcional)' },
        ]
      }]
    }),

    // ── HOME: CTA FINAL ──
    defineField({ name: 'ctaTitulo', title: 'CTA Final — Título', type: 'string' }),
    defineField({ name: 'ctaSubtitulo', title: 'CTA Final — Subtítulo', type: 'string' }),
    defineField({ name: 'ctaBoton1Texto', title: 'CTA Final — Botón 1 texto', type: 'string' }),
    defineField({ name: 'ctaBoton1Enlace', title: 'CTA Final — Botón 1 enlace', type: 'string' }),
    defineField({ name: 'ctaBoton2Texto', title: 'CTA Final — Botón 2 texto', type: 'string' }),
    defineField({ name: 'ctaBoton2Enlace', title: 'CTA Final — Botón 2 enlace', type: 'string' }),

    // ── REDES SOCIALES ──
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'twitter', title: 'Twitter/X URL', type: 'url' }),

    // ── FOOTER ──
    defineField({ name: 'footerTexto', title: 'Footer — Texto corporativo', type: 'text' }),

    // ── SEO GLOBAL ──
    defineField({ name: 'seoTitulo', title: 'SEO — Título por defecto', type: 'string' }),
    defineField({ name: 'seoDescripcion', title: 'SEO — Descripción por defecto', type: 'text',
      validation: Rule => Rule.max(160) }),
    defineField({ name: 'seoImagen', title: 'SEO — Imagen OG por defecto', type: 'image' }),
  ]
})
```

### `sanity/schemas/documents/servicio.ts`

```typescript
export default defineType({
  name: 'servicio',
  title: 'Servicios',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'titulo' },
      validation: Rule => Rule.required() }),
    defineField({ name: 'descripcionCorta', title: 'Descripción corta (para cards)', type: 'text',
      validation: Rule => Rule.max(200) }),
    defineField({ name: 'imagen', title: 'Imagen destacada', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'icono', title: 'Carácter / Número decorativo', type: 'string',
      description: 'Ej: 01, I., ¶ — aparece como elemento visual en la card' }),
    defineField({ name: 'contenido', title: 'Contenido completo', type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'orden', title: 'Orden de visualización', type: 'number' }),
    defineField({ name: 'destacado', title: 'Destacar en Home', type: 'boolean', initialValue: false }),
    // SEO
    defineField({ name: 'seoTitulo', title: 'SEO Título', type: 'string' }),
    defineField({ name: 'seoDescripcion', title: 'SEO Descripción', type: 'text',
      validation: Rule => Rule.max(160) }),
  ],
  orderings: [{ title: 'Orden manual', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'titulo', media: 'imagen' } }
})
```

### `sanity/schemas/documents/sector.ts`

```typescript
// Estructura idéntica a servicio, con campo adicional:
defineField({ name: 'colorAccento', title: 'Color de acento (hex)', type: 'string',
  description: 'Opcional, para diferenciar visualmente cada sector. Ej: #C9A84C' }),
```

### `sanity/schemas/documents/miembro.ts`

```typescript
export default defineType({
  name: 'miembro',
  title: 'Equipo',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', type: 'string', title: 'Nombre completo', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'nombre' } }),
    defineField({ name: 'cargo', type: 'string', title: 'Cargo',
      description: 'Ej: Socio, Of Counsel, Asociado Sénior' }),
    defineField({ name: 'categoria', type: 'string', title: 'Categoría',
      options: { list: ['socio', 'of-counsel', 'asociado', 'marketing', 'administracion'] } }),
    defineField({ name: 'foto', type: 'image', title: 'Fotografía profesional', options: { hotspot: true } }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn URL' }),
    defineField({ name: 'resumenCorto', type: 'text', title: 'Resumen corto (para cards)',
      validation: Rule => Rule.max(250) }),
    defineField({ name: 'biografia', type: 'array', title: 'Biografía completa',
      of: [{ type: 'block' }] }),
    defineField({ name: 'especialidades', type: 'array', title: 'Áreas de especialidad',
      of: [{ type: 'string' }] }),
    defineField({ name: 'idiomas', type: 'array', title: 'Idiomas',
      of: [{ type: 'string' }] }),
    defineField({ name: 'educacion', type: 'array', title: 'Formación académica',
      of: [{ type: 'object', fields: [
        { name: 'titulo', type: 'string', title: 'Título / Grado' },
        { name: 'institucion', type: 'string', title: 'Universidad / Institución' },
        { name: 'anio', type: 'string', title: 'Año' },
      ]}]
    }),
    defineField({ name: 'orden', type: 'number', title: 'Orden de visualización' }),
    defineField({ name: 'mostrarEnHome', type: 'boolean', title: 'Mostrar en portada', initialValue: false }),
    defineField({ name: 'activo', type: 'boolean', title: 'Activo', initialValue: true }),
  ],
  orderings: [{ title: 'Por categoría y orden', name: 'categoriaOrden',
    by: [{ field: 'categoria', direction: 'asc' }, { field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre', subtitle: 'cargo', media: 'foto' } }
})
```

### `sanity/schemas/documents/articulo.ts` (Conocimiento)

```typescript
export default defineType({
  name: 'articulo',
  title: 'Conocimiento (Blog)',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', type: 'string', title: 'Título', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'titulo' } }),
    defineField({ name: 'autor', type: 'reference', title: 'Autor', to: [{ type: 'miembro' }] }),
    defineField({ name: 'fechaPublicacion', type: 'date', title: 'Fecha de publicación' }),
    defineField({ name: 'categorias', type: 'array', title: 'Categorías',
      of: [{ type: 'string' }],
      options: { list: [
        'Derecho del Arte', 'Penal Económico', 'Reestructuraciones', 'Mercantil',
        'Laboral', 'Fiscal', 'Propiedad Intelectual', 'Bancario', 'Competencia', 'Internacional'
      ]}
    }),
    defineField({ name: 'etiquetas', type: 'array', title: 'Etiquetas', of: [{ type: 'string' }] }),
    defineField({ name: 'imagenDestacada', type: 'image', title: 'Imagen destacada', options: { hotspot: true } }),
    defineField({ name: 'extracto', type: 'text', title: 'Extracto / Resumen',
      validation: Rule => Rule.max(300) }),
    defineField({ name: 'contenido', type: 'array', title: 'Contenido del artículo',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'articulosRelacionados', type: 'array', title: 'Artículos relacionados',
      of: [{ type: 'reference', to: [{ type: 'articulo' }] }], validation: Rule => Rule.max(3) }),
    defineField({ name: 'seoTitulo', type: 'string', title: 'SEO Título' }),
    defineField({ name: 'seoDescripcion', type: 'text', title: 'SEO Descripción',
      validation: Rule => Rule.max(160) }),
    defineField({ name: 'publicado', type: 'boolean', title: 'Publicado', initialValue: false }),
  ],
  preview: { select: { title: 'titulo', subtitle: 'fechaPublicacion', media: 'imagenDestacada' } }
})
```

### `sanity/schemas/documents/noticia.ts` (Prensa)

```typescript
// Igual que articulo.ts, con campos adicionales:
defineField({ name: 'fuenteExterna', type: 'string', title: 'Fuente (medio de comunicación)',
  description: 'Ej: El País, Expansión, Financial Times' }),
defineField({ name: 'enlaceExterno', type: 'url', title: 'Enlace externo al artículo original' }),
```

---

## DATOS DE EJEMPLO (SEED DATA)

### Servicios de ejemplo

```typescript
const serviciosEjemplo = [
  {
    titulo: 'Reestructuraciones e Insolvencias',
    slug: 'reestructuraciones-e-insolvencias',
    icono: '01',
    descripcionCorta: 'Asesoramiento integral en procesos de reestructuración financiera y concursal, con una visión estratégica que trasciende el marco estrictamente legal.',
    imagen: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format',
  },
  {
    titulo: 'Penal Económico',
    slug: 'penal-economico',
    icono: '02',
    descripcionCorta: 'Defensa en procedimientos penales vinculados a la actividad empresarial: administración desleal, estafa, delitos societarios y cumplimiento normativo.',
    imagen: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format',
  },
  {
    titulo: 'Mercantil & M&A',
    slug: 'mercantil-ma',
    icono: '03',
    descripcionCorta: 'Acompañamiento en operaciones corporativas, fusiones y adquisiciones, con análisis de riesgo y estructuración de contratos complejos.',
    imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format',
  },
  {
    titulo: 'Bancario y Financiero',
    slug: 'bancario-y-financiero',
    icono: '04',
    descripcionCorta: 'Operaciones de financiación, garantías, derivados y cumplimiento normativo en el sector financiero.',
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format',
  },
  {
    titulo: 'Derecho del Arte & Propiedad Intelectual',
    slug: 'derecho-del-arte',
    icono: '05',
    descripcionCorta: 'Protección de creaciones artísticas, autenticidad de obra, derechos de autor y gestión de patrimonio cultural.',
    imagen: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format',
  },
  {
    titulo: 'Penal Económico Internacional',
    slug: 'penal-economico-internacional',
    icono: '06',
    descripcionCorta: 'Casos transfronterizos, cooperación judicial internacional, extradición y defensa ante organismos supranacionales.',
    imagen: 'https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=800&auto=format',
  },
];
```

### Miembros de equipo de ejemplo

```typescript
const miembrosEjemplo = [
  {
    nombre: 'Alejandro Reyes Montero',
    cargo: 'Socio Fundador',
    categoria: 'socio',
    email: 'a.reyes@despacho.com',
    resumenCorto: 'Más de 25 años de experiencia en reestructuraciones corporativas transfronterizas y deuda soberana. Ha liderado casos en 18 jurisdicciones.',
    especialidades: ['Reestructuraciones', 'Deuda Soberana', 'Arbitraje Internacional'],
    idiomas: ['Español', 'Inglés', 'Francés'],
    foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format',
    educacion: [
      { titulo: 'Doctor en Derecho', institucion: 'Universidad Complutense de Madrid', anio: '1998' },
      { titulo: 'LL.M. International Commercial Law', institucion: 'London School of Economics', anio: '1996' },
    ]
  },
  {
    nombre: 'Isabel Castillo Vera',
    cargo: 'Socia',
    categoria: 'socio',
    email: 'i.castillo@despacho.com',
    resumenCorto: 'Especialista en penal económico y cumplimiento normativo. Reconocida por Chambers Europe como "Leading Individual" en Compliance durante cuatro años consecutivos.',
    especialidades: ['Penal Económico', 'Compliance', 'Investigaciones Internas'],
    idiomas: ['Español', 'Inglés', 'Alemán'],
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format',
    educacion: [
      { titulo: 'Licenciatura en Derecho', institucion: 'Universidad de Salamanca', anio: '2000' },
      { titulo: 'Máster en Derecho Penal Económico', institucion: 'Universidad de Navarra', anio: '2002' },
    ]
  },
  {
    nombre: 'Rodrigo Palma Echeverría',
    cargo: 'Of Counsel',
    categoria: 'of-counsel',
    email: 'r.palma@despacho.com',
    resumenCorto: 'Ex magistrado de la Audiencia Nacional con especialización en delitos societarios. Consultor en operaciones de alto riesgo regulatorio.',
    especialidades: ['Derecho Procesal', 'Delitos Societarios', 'Regulatorio'],
    idiomas: ['Español', 'Inglés', 'Italiano'],
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format',
  },
  {
    nombre: 'Claudia Noriega Alonso',
    cargo: 'Asociada Sénior',
    categoria: 'asociado',
    email: 'c.noriega@despacho.com',
    resumenCorto: 'Enfocada en transacciones M&A y reestructuraciones operativas en los sectores de construcción e inmobiliario.',
    especialidades: ['M&A', 'Inmobiliario', 'Contratos'],
    idiomas: ['Español', 'Inglés'],
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format',
  },
];
```

### Artículos de ejemplo

```typescript
const articulosEjemplo = [
  {
    titulo: '¿Puede una IA reclamar derechos de autor sobre su obra?',
    slug: 'ia-derechos-de-autor',
    categorias: ['Propiedad Intelectual', 'Derecho del Arte'],
    extracto: 'El debate sobre la autoría de obras generadas por sistemas de inteligencia artificial plantea retos inéditos para el derecho de propiedad intelectual europeo.',
    fechaPublicacion: '2026-04-15',
    imagenDestacada: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format',
  },
  {
    titulo: 'La figura del experto independiente en la reestructuración preconcursal',
    slug: 'experto-independiente-reestructuracion',
    categorias: ['Reestructuraciones'],
    extracto: 'Análisis del rol del experto en insolvencia bajo la Directiva (UE) 2019/1023 y su transposición al derecho español.',
    fechaPublicacion: '2026-03-28',
    imagenDestacada: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format',
  },
  {
    titulo: 'Derechos de imagen y deepfakes: el vacío legal que amenaza a artistas',
    slug: 'deepfakes-derechos-imagen-artistas',
    categorias: ['Derecho del Arte', 'Propiedad Intelectual'],
    extracto: 'La proliferación de contenido sintético que reproduce la imagen o voz de artistas sin su consentimiento exige una respuesta legislativa urgente.',
    fechaPublicacion: '2026-02-10',
    imagenDestacada: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format',
  },
];
```

### Noticias de prensa de ejemplo

```typescript
const noticiasEjemplo = [
  {
    titulo: 'El despacho asesora en la mayor reestructuración del sector hotelero en Canarias',
    fuenteExterna: 'Expansión',
    fechaPublicacion: '2026-05-02',
    imagenDestacada: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format',
  },
  {
    titulo: 'Chambers Europe 2026 reconoce al despacho como firma líder en Restructuring & Insolvency',
    fuenteExterna: 'Chambers & Partners',
    fechaPublicacion: '2026-04-20',
    imagenDestacada: 'https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&auto=format',
  },
];
```

### Configuración inicial de ejemplo

```typescript
const configuracionEjemplo = {
  nombreSitio: 'Despacho de Abogados',
  heroTitulo: 'EL DERECHO ES UN INSTRUMENTO. NOSOTROS, LA ESTRATEGIA.',
  heroSubtitulos: [
    'Reestructuraciones que preservan valor.',
    'Defensa penal sin concesiones.',
    'Derecho del arte con visión global.',
  ],
  heroDescripcion: 'Un despacho de estructura reducida y máxima especialización. Trabajamos en los casos que requieren experiencia excepcional.',
  heroCtaTexto: 'Conocer el despacho',
  heroCtaEnlace: '/equipo',
  sobreTitulo: 'No somos un despacho convencional.',
  ctaTitulo: '¿Tiene un asunto complejo?',
  ctaSubtitulo: 'Escríbanos. La primera consulta es confidencial.',
  ctaBoton1Texto: 'Contactar',
  ctaBoton1Enlace: '/contacto',
  ctaBoton2Texto: 'Ver servicios',
  ctaBoton2Enlace: '/servicios',
};
```

---

## PÁGINAS — IMPLEMENTACIÓN DETALLADA

### `src/pages/index.astro` — Home

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/home/Hero.astro';
import AboutSection from '../components/home/AboutSection.astro';
import ServicesHighlight from '../components/home/ServicesHighlight.astro';
import SectorsHighlight from '../components/home/SectorsHighlight.astro';
import TeamHighlight from '../components/home/TeamHighlight.astro';
import KnowledgeHighlight from '../components/home/KnowledgeHighlight.astro';
import BadgesSection from '../components/home/BadgesSection.astro';
import CtaSection from '../components/home/CtaSection.astro';
import { getConfiguracion, getServiciosDestacados, getSectoresDestacados,
         getEquipoDestacado, getArticulosRecientes } from '../lib/queries';

const config = await getConfiguracion();
const servicios = await getServiciosDestacados();
const sectores = await getSectoresDestacados();
const equipo = await getEquipoDestacado();
const articulos = await getArticulosRecientes(3);
---
<BaseLayout seo={{ titulo: config.seoTitulo, descripcion: config.seoDescripcion }}>
  <Hero data={config} />
  <AboutSection data={config} />
  <ServicesHighlight titulo={config.serviciosTitulo} servicios={servicios} />
  <SectorsHighlight titulo={config.sectoresTitulo} sectores={sectores} />
  <TeamHighlight titulo={config.equipoTitulo} equipo={equipo} />
  <KnowledgeHighlight articulos={articulos} />
  <BadgesSection titulo={config.reconocimientosTitulo} badges={config.badges} />
  <CtaSection data={config} />
</BaseLayout>
```

### `src/pages/servicios/[slug].astro` — Servicio individual

```astro
---
export async function getStaticPaths() {
  const servicios = await getAllServicios();
  return servicios.map(s => ({ params: { slug: s.slug.current }, props: { servicio: s } }));
}
const { servicio } = Astro.props;
---
```

### `src/pages/equipo/index.astro` — Directorio del equipo

Mostrar el equipo agrupado por categorías: Socios → Of Counsels → Asociados → Otros.
Cada card tiene foto, nombre, cargo y especialidades. Al hacer clic navega al perfil individual.

### `src/pages/contacto.astro` — Contacto (datos fijos, sin CMS)

```astro
---
// Datos fijos en el componente — no requiere Sanity
const oficinas = [
  {
    ciudad: 'Madrid',
    direccion: 'Calle Serrano, 41 — 4.ª planta',
    codigoPostal: '28001',
    pais: 'España',
    telefono: '+34 91 000 00 00',
    email: 'madrid@despacho.com',
    horario: 'Lun–Vie: 9:00–19:00',
  },
  {
    ciudad: 'Las Palmas de Gran Canaria',
    direccion: 'Calle León y Castillo, 57 — 2.ª planta',
    codigoPostal: '35003',
    pais: 'España',
    telefono: '+34 928 000 000',
    email: 'laspalmas@despacho.com',
    horario: 'Lun–Vie: 9:00–18:00',
  },
  {
    ciudad: 'London',
    direccion: '10 Fleet Street — 3rd Floor',
    codigoPostal: 'EC4Y 1AU',
    pais: 'United Kingdom',
    telefono: '+44 20 0000 0000',
    email: 'london@despacho.com',
    horario: 'Mon–Fri: 9:00–18:00',
  },
];
---
```

El formulario de contacto es un island de React (`<ContactForm client:load />`) que llama a la API route `/api/contact.ts` usando Resend para enviar el email.

---

## COMPONENTES CLAVE

### `src/components/home/Hero.astro`

```astro
---
// Comportamiento:
// - Fondo: imagen de Sanity con overlay oscuro semitransparente
// - Título en Cormorant Garamond, tamaño clamp(3rem, 8vw, 8rem), uppercase, letter-spacing amplio
// - Subtítulos rotativos con Motion One: cada 3s hace fadeOut/fadeIn del siguiente texto
// - CTA aparece con delay de 1.2s tras carga
// - En mobile: imagen reemplazada por fondo negro
---
```

### `src/components/layout/Header.astro`

```astro
---
// Comportamiento:
// - Fijo en scroll (position: sticky top-0)
// - Fondo transparente sobre hero; blanco con border-b en el resto de páginas
// - Logo izquierda, navegación centro, botón "Contacto" derecha
// - En scroll > 80px: transición a fondo blanco con border
// - Mobile: icono hamburger que abre MobileMenu.tsx (island React)
// - Submenús (Servicios, Sectores, Equipo): dropdown en desktop, acordeón en mobile
---
```

### `src/components/ui/ServiceCard.astro`

```astro
---
// Card minimalista:
// - Borde superior de 1px firm-gold que se revela en hover con animación scaleX (izquierda a derecha)
// - Número/carácter decorativo (icono) en firm-gold, Cormorant Garamond, grande
// - Título en negro, sans-serif, uppercase, pequeño letter-spacing
// - Descripción en gris, body size, 2 líneas max (line-clamp-2)
// - Sin sombra. Sin background de color.
// - Flecha "→" que se mueve +4px en hover (transition transform)
---
```

### `src/components/interactive/ContactForm.tsx`

```typescript
// React island con React Hook Form + Zod
// Campos: nombre (req), empresa (opt), email (req), teléfono (opt), asunto (req), mensaje (req),
//         checkbox aceptación política de privacidad (req)
// Al enviar: POST a /api/contact.ts → Resend → email al despacho
// Estados visuales: idle → sending → success/error (sin librerías de toast, inline)
// Estilo: inputs con solo border-bottom, sin border completo; label flota al focus (CSS)
```

### `src/lib/queries.ts`

```typescript
// Todas las queries GROQ organizadas aquí
export const getConfiguracion = () => client.fetch(`
  *[_type == "configuracion"][0]{
    heroTitulo, heroSubtitulos, heroDescripcion, heroCtaTexto, heroCtaEnlace,
    heroImagen, sobreTitulo, sobreContenido, sobreImagen, sobreCtaTexto, sobreCtaEnlace,
    serviciosTitulo, sectoresTitulo, equipoTitulo, reconocimientosTitulo,
    badges[]{ imagen, titulo, enlace },
    ctaTitulo, ctaSubtitulo, ctaBoton1Texto, ctaBoton1Enlace, ctaBoton2Texto, ctaBoton2Enlace,
    linkedin, instagram, twitter, footerTexto,
    seoTitulo, seoDescripcion, "seoImagenUrl": seoImagen.asset->url
  }
`);

export const getServiciosDestacados = () => client.fetch(`
  *[_type == "configuracion"][0].serviciosDestacados[]->{
    titulo, "slug": slug.current, descripcionCorta, icono,
    "imagenUrl": imagen.asset->url
  }
`);

// ... resto de queries para sectores, equipo, artículos, noticias
```

---

## IMÁGENES DE EJEMPLO — GUÍA DE USO

Usa imágenes de **Unsplash** (libres de derechos) durante el desarrollo. El componente `SanityImage.astro` las reemplazará por las de Sanity en producción.

| Contexto | ID de foto Unsplash |
|---|---|
| Hero (ciudad/abstracto) | `photo-1477959858617-67f85cf4f1df` |
| Servicios (documentos) | `photo-1450101499163-c8848c66ca85` |
| Equipo hombre 1 | `photo-1560250097-0b93528c311a` |
| Equipo hombre 2 | `photo-1507003211169-0a1dd7228f2d` |
| Equipo mujer 1 | `photo-1573496359142-b8d87734a5a2` |
| Equipo mujer 2 | `photo-1580489944761-15a19d654956` |
| Blog / Arte | `photo-1561214115-f2f134cc4912` |
| Blog / Legal | `photo-1589829545856-d10d557cf95f` |
| Sector Financiero | `photo-1611974789855-9c2a0a7236a3` |
| Sector Construcción | `photo-1504307651254-35680f356dfd` |
| Sector Arte | `photo-1579783902614-a3fb3927b6a5` |
| Sector Turismo | `photo-1566073771259-6a8506099945` |

Formato de URL: `https://images.unsplash.com/[id]?w=800&q=80&auto=format&fit=crop`

---

## SANITY STUDIO — CONFIGURACIÓN

### `sanity/sanity.config.ts`

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'Panel de Contenidos',
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Panel de Control')
          .items([
            S.listItem()
              .title('⚙️  Configuración del Sitio')
              .child(S.document().schemaType('configuracion').documentId('configuracion')),
            S.divider(),
            S.documentTypeListItem('servicio').title('📋  Servicios'),
            S.documentTypeListItem('sector').title('🏛️  Sectores'),
            S.documentTypeListItem('miembro').title('👤  Equipo'),
            S.divider(),
            S.documentTypeListItem('articulo').title('📝  Conocimiento (Blog)'),
            S.documentTypeListItem('noticia').title('📰  Prensa'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemas },
});
```

### Variables de entorno necesarias

```env
# .env.local
PUBLIC_SANITY_PROJECT_ID=xxxxxxxxxxxx
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...
RESEND_API_KEY=re_...
CONTACT_EMAIL=info@despacho.com
```

---

## ASTRO CONFIG

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { sanityIntegration } from '@sanity/astro';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sanityIntegration({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: 'production',
      useCdn: true,
      apiVersion: '2024-01-01',
      studioBasePath: '/studio',
    }),
  ],
});
```

---

## REQUISITOS FUNCIONALES ADICIONALES

1. **View Transitions API** de Astro: activar `<ViewTransitions />` en `BaseLayout.astro` para navegación fluida entre páginas.
2. **Búsqueda**: integrar `@pagefind/default-ui` para búsqueda estática del blog. El índice se genera en build time.
3. **Paginación** en `/conocimiento` y `/prensa`: 9 artículos por página, URLs tipo `/conocimiento/2`.
4. **Filtrado por categoría** en blog: URLs tipo `/conocimiento/categoria/derecho-del-arte`.
5. **SEO**: generar `sitemap.xml` con `@astrojs/sitemap`. Implementar JSON-LD (`LegalService`) en `BaseLayout.astro`.
6. **Rendimiento**: todas las imágenes con `<Image>` de Astro, formato WebP, lazy loading por defecto.
7. **Accesibilidad**: `aria-label` en iconos, skip-to-content link, foco visible con ring en firm-gold.
8. **GDPR**: banner de cookies con aceptación/rechazo. Google Analytics solo se carga tras aceptación.

---

## CRITERIOS DE ACEPTACIÓN

- [ ] Lighthouse Performance ≥ 95 en desktop, ≥ 85 en mobile
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO = 100
- [ ] Todas las secciones de Home se editan desde Sanity sin tocar código
- [ ] Añadir/editar/eliminar servicios, sectores, miembros, artículos desde panel
- [ ] El formulario de contacto funciona (email recibido en CONTACT_EMAIL)
- [ ] Responsive correcto en 375px, 768px, 1280px, 1920px
- [ ] View Transitions sin parpadeos entre páginas
- [ ] Imágenes en WebP, ninguna sin atributo `alt`
- [ ] Formulario con protección CSRF (token en API route)
