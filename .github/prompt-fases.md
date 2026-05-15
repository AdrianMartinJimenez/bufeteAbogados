# Prompt por Fases — Web Corporativa Despacho de Abogados

> Referencia completa: `prompt-desarrollo-web.md`
> Stack: Astro 5 · TypeScript · Tailwind CSS 4 · Sanity v3 · React islands · Vercel

Ejecuta cada fase en orden. No avances a la siguiente hasta que la actual esté completamente funcional y sin errores de TypeScript.

---

## FASE 1 — Setup del Proyecto

**Objetivo:** Proyecto Astro funcional con todas las dependencias configuradas.

```
Crea el proyecto base siguiendo estas instrucciones exactas:

1. Inicializa el proyecto:
   pnpm create astro@latest bufete-web -- --template minimal --typescript strict --no-git

2. Instala dependencias:
   pnpm add @astrojs/react @astrojs/tailwind @astrojs/sanity @astrojs/vercel @astrojs/sitemap
   pnpm add @sanity/client @sanity/image-url sanity @sanity/vision
   pnpm add react react-dom react-hook-form zod
   pnpm add @motionone/dom
   pnpm add resend
   pnpm add -D tailwindcss @tailwindcss/typography prettier prettier-plugin-astro @types/react @types/react-dom

3. Crea astro.config.mjs:
   - output: 'hybrid'
   - adapter: vercel()
   - integrations: react(), tailwind({ applyBaseStyles: false }), sitemap(),
     sanityIntegration({ projectId: process.env.PUBLIC_SANITY_PROJECT_ID, dataset: 'production',
     useCdn: import.meta.env.PROD, apiVersion: '2024-01-01', studioBasePath: '/studio' })

4. Crea tailwind.config.mjs con:
   - Fuentes: fontFamily: { serif: ['Cormorant Garamond', 'Georgia', 'serif'], sans: ['Inter', 'system-ui', 'sans-serif'] }
   - Colores personalizados bajo la clave "firm":
     black: '#0A0A0A', white: '#F8F7F4', gold: '#C9A84C', muted: '#6B6B6B', border: '#E2E0DB'
   - Plugin: @tailwindcss/typography

5. Crea src/styles/global.css:
   - @tailwind base/components/utilities
   - @import Google Fonts: Cormorant Garamond (300,400,500 + italic) + Inter (300,400,500)
   - Variables CSS: --font-serif, --font-sans
   - Reset base: body usa font-sans, color firm-black, background firm-white
   - Clase .font-serif aplica font-serif
   - Smooth scroll en html

6. Crea .env.local con las variables:
   PUBLIC_SANITY_PROJECT_ID=placeholder
   PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=placeholder
   RESEND_API_KEY=placeholder
   CONTACT_EMAIL=info@despacho.com

7. Crea src/lib/sanity.ts con el cliente Sanity usando createClient y las env vars.

8. Crea tsconfig.json con paths alias: "@/*" → ["./src/*"]

Resultado esperado: `pnpm dev` arranca sin errores. La ruta /studio carga Sanity Studio (en blanco, sin schemas aún).
```

---

## FASE 2 — Schemas de Sanity

**Objetivo:** Panel de control completo con todos los tipos de contenido definidos.

```
Crea los schemas de Sanity en la carpeta sanity/schemas/. Todos los archivos usan
defineType y defineField de 'sanity'. NO uses tipos deprecated.

── sanity/schemas/documents/configuracion.ts (SINGLETON)
   Tipo: 'document', __experimental_actions: ['update', 'publish']
   Campos agrupados en secciones (usa fieldsets o simplemente en orden con comentarios):

   IDENTIDAD: nombreSitio (string), logo (image), logoOscuro (image), favicon (image)

   HERO: heroTitulo (string), heroSubtitulos (array of string),
         heroDescripcion (text), heroCtaTexto (string), heroCtaEnlace (string),
         heroImagen (image con hotspot)

   SOBRE NOSOTROS: sobreTitulo (string), sobreContenido (array of block),
                   sobreImagen (image con hotspot), sobreCtaTexto (string), sobreCtaEnlace (string)

   SERVICIOS EN HOME: serviciosTitulo (string),
                      serviciosDestacados (array of reference to 'servicio', max 6)

   SECTORES EN HOME: sectoresTitulo (string),
                     sectoresDestacados (array of reference to 'sector', max 6)

   EQUIPO EN HOME: equipoTitulo (string),
                   equipoDestacado (array of reference to 'miembro', max 4)

   RECONOCIMIENTOS: reconocimientosTitulo (string),
                    badges (array of object con campos: imagen image, titulo string, enlace url)

   CTA FINAL: ctaTitulo (string), ctaSubtitulo (string),
              ctaBoton1Texto (string), ctaBoton1Enlace (string),
              ctaBoton2Texto (string), ctaBoton2Enlace (string)

   REDES SOCIALES: linkedin (url), instagram (url), twitter (url)

   FOOTER: footerTexto (text)

   SEO: seoTitulo (string), seoDescripcion (text max 160), seoImagen (image)

── sanity/schemas/documents/servicio.ts
   Campos: titulo* (string), slug* (slug, source: titulo), descripcionCorta (text max 200),
           imagen (image hotspot), icono (string, desc: "Ej: 01, I., ¶"),
           contenido (array of block + image), orden (number),
           destacado (boolean, default false), seoTitulo (string), seoDescripcion (text max 160)
   orderings: por campo 'orden' ascendente
   preview: titulo + imagen

── sanity/schemas/documents/sector.ts
   Igual que servicio.ts, añadir: colorAccento (string, desc: "Color hex opcional, ej: #C9A84C")

── sanity/schemas/documents/miembro.ts
   Campos: nombre* (string), slug (slug, source: nombre), cargo (string),
           categoria (string con options list: socio|of-counsel|asociado|marketing|administracion),
           foto (image hotspot), email (string), linkedin (url),
           resumenCorto (text max 250), biografia (array of block),
           especialidades (array of string), idiomas (array of string),
           educacion (array of object: titulo string, institucion string, anio string),
           orden (number), mostrarEnHome (boolean, default false), activo (boolean, default true)
   orderings: por categoria asc + orden asc
   preview: nombre + cargo + foto

── sanity/schemas/documents/articulo.ts
   Campos: titulo* (string), slug (slug), autor (reference to miembro),
           fechaPublicacion (date), publicado (boolean, default false),
           categorias (array of string con options list:
             'Derecho del Arte','Penal Económico','Reestructuraciones','Mercantil',
             'Laboral','Fiscal','Propiedad Intelectual','Bancario','Competencia','Internacional'),
           etiquetas (array of string), imagenDestacada (image hotspot),
           extracto (text max 300), contenido (array of block + image),
           articulosRelacionados (array of reference to articulo, max 3),
           seoTitulo (string), seoDescripcion (text max 160)
   preview: titulo + fechaPublicacion + imagenDestacada

── sanity/schemas/documents/noticia.ts
   Igual que articulo.ts, añadir:
   fuenteExterna (string, desc: "Ej: El País, Expansión"), enlaceExterno (url)
   (articulosRelacionados se sustituye por noticiasRelacionadas referenciando 'noticia')

── sanity/schemas/index.ts
   Exporta array con todos los schemas anteriores

── sanity/sanity.config.ts
   defineConfig con:
   - title: 'Panel de Contenidos'
   - projectId y dataset desde process.env
   - plugins: structureTool con estructura personalizada en español:
       • Item singleton "⚙️  Configuración del Sitio" (documentId: 'configuracion')
       • Divider
       • "📋  Servicios" (servicio)
       • "🏛️  Sectores" (sector)
       • "👤  Equipo" (miembro)
       • Divider
       • "📝  Conocimiento (Blog)" (articulo)
       • "📰  Prensa" (noticia)
   - plugins: también visionTool() para desarrollo
   - schema: { types: schemas }

Resultado esperado: /studio carga el panel con los 6 tipos de contenido en el sidebar.
No debe haber errores de TypeScript.
```

---

## FASE 3 — Layouts y Componentes de Layout

**Objetivo:** Estructura visual base (Header, Footer, navegación) completamente funcional y responsive.

```
Crea los layouts y componentes de layout. El diseño es minimalista:
blanco/negro/dorado, tipografía dominante, sin sombras, sin decoración superflua.

── src/layouts/BaseLayout.astro
   Props: { seo?: { titulo?: string; descripcion?: string; imagen?: string } }
   Incluye en <head>:
   - <meta charset>, viewport, title (props.seo.titulo ?? nombreSitio), description, OG tags
   - JSON-LD Schema.org tipo LegalService con datos del despacho
   - <ViewTransitions /> de astro:transitions
   - global.css
   Estructura: <Header /> | <slot /> | <Footer />
   El fondo del body es firm-white.

── src/layouts/PageLayout.astro
   Extiende BaseLayout. Añade una cabecera de página con:
   - Props: { titulo: string; subtitulo?: string; seo?: {...} }
   - Sección superior con fondo firm-black, título en Cormorant Garamond grande,
     subtítulo opcional en gris, padding py-24
   - Luego el <slot />

── src/layouts/ArticleLayout.astro
   Extiende BaseLayout. Para artículos y noticias:
   - Imagen de cabecera a pantalla completa con overlay
   - Título, fecha, categorías, autor superpuestos sobre la imagen
   - Contenido en columna centrada max-w-3xl, tipografía legible (prose de Tailwind)
   - Sidebar opcional con artículos relacionados

── src/components/layout/Header.astro
   Comportamiento:
   - position: sticky top-0, z-50
   - Fondo: transparente en la home sobre el hero; en el resto de páginas bg-firm-white border-b border-firm-border
   - En home: detectar scroll > 80px con IntersectionObserver y transitar a fondo blanco
   - Estructura: logo (izquierda) | navegación principal (centro) | botón Contacto (derecha)
   - Logo: texto "DESPACHO" en Cormorant Garamond + logotipo SVG placeholder
   - Navegación: Inicio, Servicios (dropdown), Sectores (dropdown), Equipo, Conocimiento, Prensa
   - Los dropdowns de Servicios/Sectores/Equipo cargan los items desde Sanity en build time
   - Botón Contacto: borde 1px firm-black, hover fondo firm-black color blanco, transición 200ms
   - Mobile (< lg): ocultar nav central, mostrar hamburger icon que abre <MobileMenu client:load />

── src/components/layout/Footer.astro
   Datos de configuración vienen de Sanity (getConfiguracion).
   Estructura en grid de 4 columnas (2 en tablet, 1 en mobile):
   - Col 1: Logo + texto corporativo + redes sociales (LinkedIn, Instagram, Twitter)
   - Col 2: Servicios (links a los 6 primeros)
   - Col 3: Despacho (Equipo, Conocimiento, Prensa, Contacto)
   - Col 4: Legal (Política de Privacidad, Política de Cookies, Aviso Legal)
   Franja inferior: copyright + año actual (JS)
   Todo en firma-black sobre fondo blanco, separado del contenido con border-t

── src/components/interactive/MobileMenu.tsx (React island)
   Props: { servicios: {titulo,slug}[]; sectores: {titulo,slug}[] }
   Estado: isOpen boolean
   Cuando isOpen:
   - Panel full-screen bg-firm-black text-firm-white
   - Navegación vertical con acordeones para Servicios, Sectores, Equipo
   - Animación: transform translateX de derecha a izquierda, 300ms ease
   - Botón de cierre (×) en esquina superior derecha
   - Links con font-serif tamaño grande, espaciado generoso

Resultado esperado: La home muestra header y footer. El header cambia de transparente a blanco al hacer scroll.
El menú mobile funciona. No hay errores de hidratación React.
```

---

## FASE 4 — Página Principal (Home)

**Objetivo:** Home completa con todas las secciones cargadas desde Sanity, con datos de ejemplo.

```
Crea src/pages/index.astro y todos sus componentes de sección.
Todos los datos vienen de Sanity mediante las queries de src/lib/queries.ts.
Usa los datos de ejemplo del archivo prompt-desarrollo-web.md como seed en Sanity Studio
antes de implementar (introduce los datos manualmente en /studio).

── src/lib/queries.ts
   Implementa todas las funciones de consulta:

   getConfiguracion(): query GROQ para el documento singleton 'configuracion'
     Incluye todos los campos incluyendo referencias resueltas para badges.
     Para heroImagen y sobreImagen incluir "...asset->{ url, metadata { dimensions } }"

   getServiciosDestacados(): resuelve serviciosDestacados[] del singleton
     Proyecta: titulo, slug.current as slug, descripcionCorta, icono, imagen url

   getSectoresDestacados(): igual para sectoresDestacados[]

   getEquipoDestacado(): resuelve equipoDestacado[] del singleton
     Proyecta: nombre, slug.current as slug, cargo, categoria, resumenCorto,
               especialidades, foto url

   getArticulosRecientes(n: number): últimos n artículos publicados ordenados por fechaPublicacion desc
     Proyecta: titulo, slug.current as slug, fechaPublicacion, categorias,
               extracto, imagenDestacada url, "autorNombre": autor->nombre

── src/pages/index.astro
   Importa y llama en paralelo (Promise.all) a todas las queries.
   Renderiza en orden: Hero → About → Services → Sectors → Team → Knowledge → Badges → CTA

── src/components/home/Hero.astro
   Props: data (configuracion)
   - Altura: min-h-screen, flex items-end pb-24 (texto en la parte inferior)
   - Fondo: imagen de Sanity con overlay negro opacity-50
   - Título: Cormorant Garamond, clamp(4rem, 8vw, 9rem), uppercase, tracking-widest, text-white
   - Subtítulos rotativos: div con height fija, los textos rotan cada 3.5s con Motion One
     (animate con opacity 0→1→1→0, transform translateY 20px→0→0→-20px)
   - Descripción: Inter 300, text-white/70, max-w-lg, mt-6
   - Botón CTA: border border-white text-white py-3 px-8, hover bg-white text-firm-black,
     aparece con animación delay 1.2s
   - En mobile: imagen reemplazada por bg-firm-black

── src/components/home/AboutSection.astro
   Props: data (configuracion)
   - Layout 2 columnas en desktop: texto (izq) + imagen (der), invertido en mobile
   - Título: Cormorant Garamond grande, italic
   - Contenido: PortableText con tipografía Inter
   - Imagen con clase grayscale hover:grayscale-0 transition-all duration-500
   - CTA link con flecha → y animación de subrayado en hover

── src/components/home/ServicesHighlight.astro
   Props: titulo (string), servicios (array)
   - Título de sección alineado a la izquierda, pequeño uppercase Inter + línea decorativa
   - Grid 3 columnas (2 en tablet, 1 en mobile) de ServiceCards
   - Link "Ver todos los servicios →" al final

── src/components/ui/ServiceCard.astro
   Props: titulo, slug, descripcionCorta, icono, imagenUrl
   - Sin background, solo bordes
   - Border-top: 1px solid firm-border. En hover: color firm-gold con transición scaleX
   - Icono: Cormorant Garamond, 4rem, color firm-gold, opacity-40
   - Título: Inter 500, uppercase, tracking-wider, small
   - Descripción: Inter 300, muted, line-clamp-2
   - Flecha →: se mueve translateX(4px) en hover

── src/components/home/SectorsHighlight.astro
   Props: titulo, sectores
   - Grid horizontal scrollable en mobile, 3 cols en desktop
   - Cada sector: SectorCard con imagen de fondo (grayscale hover:grayscale-0)

── src/components/ui/SectorCard.astro
   Props: titulo, slug, imagenUrl, colorAccento?
   - Card con imagen de fondo, overlay negro 60%, texto blanco superpuesto
   - Ratio 4:3
   - Título Cormorant Garamond italic blanco
   - En hover: overlay se reduce a 40%, imagen escala 1.05 (transform)

── src/components/home/TeamHighlight.astro
   Props: titulo, equipo
   - Grid 4 columnas (2 en tablet, 1 en mobile)
   - Solo muestra socios y el primer of-counsel si hay menos de 4 socios

── src/components/ui/TeamCard.astro
   Props: nombre, slug, cargo, foto, resumenCorto, especialidades
   - Foto cuadrada (ratio 1:1) con grayscale hover:grayscale-0
   - Nombre: Cormorant Garamond, grande
   - Cargo: Inter uppercase small muted
   - Especialidades: tags en Inter tiny, firm-border, sin color de fondo

── src/components/home/KnowledgeHighlight.astro
   Props: articulos (últimos 3)
   - Título de sección
   - Grid 3 columnas con ArticleCard
   - Link "Ver todos los artículos →"

── src/components/ui/ArticleCard.astro
   Props: titulo, slug, fechaPublicacion, categorias, extracto, imagenUrl, autorNombre?, tipo ('articulo'|'noticia')
   - Imagen con ratio 16:9, grayscale hover:grayscale-0
   - Categoría: Inter uppercase tiny, firm-gold
   - Fecha: Inter tiny muted
   - Título: Cormorant Garamond, tamaño medio, hover color firm-gold
   - Extracto: Inter 300 small, line-clamp-3

── src/components/home/BadgesSection.astro
   Props: titulo, badges
   - Fondo firm-black
   - Logos/badges en fila horizontal, centrados, grayscale opacity-60 hover:opacity-100 hover:grayscale-0
   - Sin texto extra

── src/components/home/CtaSection.astro
   Props: data (ctaTitulo, ctaSubtitulo, ctaBoton1*, ctaBoton2*)
   - Fondo blanco, borde top y bottom firm-border
   - Título Cormorant Garamond muy grande, centrado
   - Subtítulo Inter muted
   - Dos botones: primero sólido (bg-firm-black text-white), segundo outline

Resultado esperado: La home completa se ve con los datos de ejemplo de Sanity.
Todas las secciones son editables desde /studio sin tocar código.
```

---

## FASE 5 — Secciones de Menú: Servicios, Sectores, Equipo

**Objetivo:** Las tres secciones principales del menú completamente funcionales con páginas de listado y detalle.

```
── src/pages/servicios/index.astro
   Layout: PageLayout con titulo="Servicios", subtitulo="Asesoramiento especializado"
   Carga todos los servicios de Sanity (getAllServicios, ordenados por 'orden').
   Grid 3 columnas de ServiceCard (versión extendida con imagen).
   Introduce todos los servicios de ejemplo del prompt-desarrollo-web.md en Sanity.

── src/pages/servicios/[slug].astro
   getStaticPaths: getAllServicios() → map a { params: {slug}, props: {servicio} }
   Query del servicio: todos los campos incluyendo contenido PortableText.
   Layout: PageLayout con titulo={servicio.titulo}
   Estructura:
   - Imagen destacada a ancho completo (si existe), altura 60vh, object-cover
   - Contenido rich text en columna max-w-3xl mx-auto con @tailwindcss/typography
   - Sidebar (desktop): otros servicios como lista de links
   SEO: usa seoTitulo/seoDescripcion si existen, si no usa titulo/descripcionCorta

── src/pages/sectores/index.astro
   Similar a servicios pero con SectorCard (con imagen de fondo).
   Grid 2 columnas en desktop.

── src/pages/sectores/[slug].astro
   Similar a servicios/[slug].astro

── src/pages/equipo/index.astro
   Layout: PageLayout con titulo="Equipo"
   Query: getAllMiembros() agrupados por categoría.
   Renderiza 4 secciones en orden: Socios → Of Counsel → Asociados → Marketing & Admin
   Cada sección: título de categoría + grid de TeamCard
   Solo mostrar categorías que tengan al menos 1 miembro activo.
   Introduce los miembros de ejemplo del prompt-desarrollo-web.md en Sanity.

── src/pages/equipo/[slug].astro
   getStaticPaths: getAllMiembros()
   Layout: PageLayout con titulo={miembro.nombre}
   Estructura de perfil:
   - Foto grande (portrait), nombre, cargo, datos de contacto
   - Biografía completa (PortableText)
   - Secciones: Especialidades, Idiomas, Formación académica
   - Cada sección con estilo de lista minimalista (border-b en cada item)

── src/components/ui/PortableText.astro
   Props: value (PortableTextBlock[])
   Usa @portabletext/to-html o implementa renderer manual para:
   - Párrafos, headings h2/h3/h4
   - Negrita, cursiva, enlaces
   - Imágenes inline (usando SanityImage.astro)
   Aplica clase .prose de Tailwind al contenedor

── src/components/ui/SanityImage.astro
   Props: image (SanityImageObject), alt: string, width?: number, height?: number, class?: string
   Usa @sanity/image-url para construir la URL con parámetros de optimización.
   Renderiza como <img> con width/height calculados y loading="lazy" por defecto.
   Si no hay imagen, renderiza un placeholder div con bg-firm-border.

Resultado esperado: Las tres secciones del menú funcionan. Las páginas de detalle
se generan estáticamente. Los perfiles de equipo muestran toda la información.
```

---

## FASE 6 — Blog: Conocimiento y Prensa

**Objetivo:** Dos secciones de blog con paginación, filtros por categoría y páginas de detalle.

```
── src/lib/queries.ts (ampliar con nuevas funciones)

   getArticulos(page: number, perPage = 9, categoria?: string):
     Filtra por publicado == true, opcionalmente por categoria en categorias[].
     Ordena por fechaPublicacion desc.
     Retorna { items, total, totalPages }.

   getNoticias(page: number, perPage = 9): similar para noticias

   getArticuloBySlug(slug: string): artículo completo con autor resuelto y relacionados[]
   getNoticiaBySlug(slug: string): noticia completa
   getAllArticuloSlugs(): para getStaticPaths
   getAllNoticiaSlugs(): para getStaticPaths
   getCategorias(): array de strings únicos de todas las categorías usadas en artículos publicados

── src/pages/conocimiento/index.astro
   Layout: PageLayout titulo="Conocimiento"
   Carga primera página (9 artículos) + lista de categorías.
   Grid 3 columnas de ArticleCard.
   Filtros de categoría: lista de pills/chips clickables (links a /conocimiento/categoria/[cat])
   Paginación: links numéricos → /conocimiento/2, /conocimiento/3

── src/pages/conocimiento/[...page].astro
   Paginación dinámica. page = 1 por defecto.
   getStaticPaths: genera paths para todas las páginas necesarias basándose en total de artículos.
   Mismo layout que index pero sin filtros repetidos.

── src/pages/conocimiento/categoria/[categoria].astro
   getStaticPaths: getCategorias() → map a paths con slug de categoría (lowercase, kebab-case).
   Muestra artículos filtrados por categoría.
   Muestra el nombre de categoría en el título de página.

── src/pages/conocimiento/[slug].astro
   ArticleLayout con imagen de cabecera.
   Contenido completo en PortableText.
   Muestra: autor (foto + nombre + cargo), fecha, categorías, tiempo de lectura estimado.
   Sección "Artículos relacionados" al final (hasta 3).

── src/pages/prensa/ (estructura idéntica a conocimiento/)
   index.astro, [...page].astro, [slug].astro
   Las noticias muestran adicionalmente: fuenteExterna, enlaceExterno (si existe, abre en nueva pestaña).
   Introduce las noticias de ejemplo del prompt-desarrollo-web.md en Sanity.

── Componente de paginación (src/components/ui/Pagination.astro)
   Props: currentPage, totalPages, basePath (ej: '/conocimiento')
   Muestra: anterior, páginas numeradas (máx 5 visibles), siguiente.
   Estilos: números simples con border en página activa (firm-black), hover firm-gold.

Resultado esperado: Blog funcional con paginación. Los artículos de ejemplo
aparecen en /conocimiento. Las categorías filtran correctamente.
El tiempo de lectura se calcula aproximadamente (palabras / 200 palabras por minuto).
```

---

## FASE 7 — Contacto, Formulario y API

**Objetivo:** Página de contacto funcional con formulario que envía emails mediante Resend.

```
── src/pages/contacto.astro
   Layout: PageLayout titulo="Contacto"
   Datos de oficinas: hardcodeados en el componente (NO desde Sanity):
     Madrid: Calle Serrano, 41 — 4.ª planta, 28001, +34 91 000 00 00, madrid@despacho.com, Lun-Vie 9-19h
     Las Palmas: Calle León y Castillo, 57 — 2.ª planta, 35003, +34 928 000 000, laspalmas@despacho.com
     London: 10 Fleet Street, 3rd Floor, EC4Y 1AU, +44 20 0000 0000, london@despacho.com
   Layout de la página:
   - Grid 2 columnas: oficinas (izq, 5/12) + formulario (der, 7/12)
   - Cada oficina: ciudad en Cormorant grande, dirección y datos en Inter small
   - Separadas con border-b
   - Formulario: <ContactForm client:load />

── src/components/interactive/ContactForm.tsx (React island)
   Usa react-hook-form + zod.
   Schema Zod:
     nombre: string min 2
     empresa: string optional
     email: string email
     telefono: string optional
     asunto: string min 3
     mensaje: string min 20 max 2000
     privacidad: boolean true (literal true)

   Estilos de inputs:
   - Solo border-bottom (border-b border-firm-border), sin border completo
   - Sin background (bg-transparent)
   - Label flotante: position absolute, transición top/font-size al focus o cuando tiene valor
   - Error messages: texto rojo pequeño bajo el input
   - Botón enviar: bg-firm-black text-white py-4 px-10, full width en mobile
   - En estado sending: deshabilitar botón, mostrar spinner (CSS puro, no librería)
   - Estado success: mensaje inline en verde discreto, ocultar el formulario
   - Estado error: mensaje inline en rojo, NO ocultar el formulario

   Al submit: POST /api/contact con JSON body.

── src/pages/api/contact.ts (Astro SSR API route)
   export const prerender = false
   Solo acepta método POST.
   Protección CSRF: verificar header Origin o implementar token en formulario.
   Valida el body con el mismo schema Zod del frontend (importar schema compartido de src/lib/schemas.ts).
   Si válido: usa Resend para enviar email a process.env.CONTACT_EMAIL.
     Email con template HTML básico: datos del solicitante + mensaje.
     Reply-to: email del solicitante.
   Retorna JSON { ok: true } o { ok: false, error: string }.
   Rate limiting básico: no más de 5 requests por IP en 10 minutos (Map en memoria, suficiente para SSR).

── src/lib/schemas.ts
   Exporta el schema Zod de contacto para compartir entre frontend y API.

Resultado esperado: El formulario envía el email correctamente.
Se recibe en CONTACT_EMAIL con los datos del formulario.
Los errores de validación se muestran inline sin recargar la página.
```

---

## FASE 8 — SEO, Rendimiento y Accesibilidad

**Objetivo:** Puntuaciones Lighthouse ≥ 95 en Performance y Accessibility, SEO = 100.

```
Aplica las siguientes optimizaciones en todo el proyecto:

SEO:
- Revisa que BaseLayout.astro tenga: title único por página, meta description,
  canonical URL, og:title, og:description, og:image, og:type, og:url,
  twitter:card, twitter:title, twitter:description, twitter:image
- JSON-LD en BaseLayout: Schema.org LegalService con name, url, description,
  areaServed, telephone, address (usando datos hardcoded del despacho)
- En páginas de artículo: añadir Schema.org Article con author, datePublished, headline
- Todos los sitemap: configurar @astrojs/sitemap en astro.config.mjs con
  changefreq y priority apropiados por tipo de página
- Asegurar que ninguna página tiene h1 duplicado

RENDIMIENTO:
- Todas las imágenes: usar componente <Image> de Astro (import from 'astro:assets')
  con width, height explícitos, format="webp", loading="lazy" (excepto hero: loading="eager")
- Para imágenes de Sanity en SanityImage.astro: usar URL params de Sanity
  (?w=800&h=600&fit=crop&auto=format&fm=webp)
- Verificar que no hay imports de librerías completas donde solo se usa una función
- El hero usa loading="eager" y fetchpriority="high" en la imagen
- Fuentes: preconnect a fonts.googleapis.com, preload de los 2 archivos woff2 críticos
- No hay CSS inlineado en <style global> innecesario

ACCESIBILIDAD:
- Skip-to-content link: primer elemento del body,
  posición absoluta top-0, visible solo en focus (translate-y con focus:translate-y-0)
- Todos los <img> tienen atributo alt descriptivo (no vacío a menos que sea decorativa)
- Imágenes decorativas: alt="" y aria-hidden="true"
- Header nav: <nav aria-label="Navegación principal">
- Footer nav: <nav aria-label="Navegación secundaria">
- Menú mobile: aria-expanded, aria-controls en el botón hamburger
- Dropdowns: role="menu", role="menuitem", manejo de teclado (Escape para cerrar)
- Links: texto descriptivo, no "click aquí"
- Formulario: cada input tiene <label> asociado con htmlFor, mensajes de error con aria-live="polite"
- Focus visible: outline firm-gold (ring-2 ring-firm-gold ring-offset-2) en todos los elementos interactivos
- Color contrast: verificar que todos los textos pasan WCAG AA (4.5:1)

GDPR / COOKIES:
- Crea src/components/interactive/CookieBanner.tsx (React island)
  - Se muestra la primera vez (estado en localStorage 'cookie-consent')
  - Opciones: "Aceptar todo" | "Solo esenciales"
  - Google Analytics (si se usa): solo inyectar el script tras aceptación
  - Posición: fixed bottom-0 full width, bg-firm-black text-white, py-4
  - Estilo minimalista, sin modal, solo franja

Resultado esperado: Lighthouse en todas las páginas principales:
Performance ≥ 95 desktop / ≥ 85 mobile, Accessibility ≥ 95, SEO = 100, Best Practices ≥ 95.
```

---

## FASE 9 — Páginas Legales, Búsqueda y Pulido Final

**Objetivo:** Proyecto completo, producción-ready, listo para deploy en Vercel.

```
── Páginas legales (datos hardcodeados, sin CMS)
   src/pages/politica-privacidad.astro
   src/pages/politica-cookies.astro
   src/pages/aviso-legal.astro

   Cada una usa PageLayout y tiene contenido genérico apropiado para un despacho español.
   Incluir fecha de "última actualización" automática.
   Contenido con PortableText simulado (HTML estático con clases prose).

── Búsqueda con Pagefind
   Instalar: pnpm add -D pagefind
   Configurar en astro.config.mjs: integración de Pagefind post-build
   Añadir data-pagefind-body en ArticleLayout y PageLayout
   Añadir data-pagefind-ignore en Header, Footer, sidebars

   src/components/interactive/SearchOverlay.tsx
   - Botón de búsqueda en el Header (lupa icon SVG)
   - Al click: overlay full-screen con input centrado
   - Resultados en tiempo real bajo el input usando PagefindUI
   - Cerrar con Escape o click fuera
   - Estilos: fondo firm-white/95, resultados como lista de ArticleCard simplificada

── 404 personalizada
   src/pages/404.astro
   - Número "404" en Cormorant Garamond enorme, firm-gold
   - Mensaje en Inter
   - Link a inicio

── Transiciones entre páginas
   Verificar que <ViewTransitions /> está en BaseLayout.
   Añadir transition:name a elementos que deben persistir visualmente:
   - Logo del header
   - Imágenes de cards que aparecen en detalle (transition:name={`img-${slug}`})

── Verificación final
   Ejecutar estos checks y corregir cualquier problema:

   1. pnpm build — sin errores ni warnings
   2. pnpm preview — verificar todas las rutas
   3. Verificar en /studio que todos los campos de la configuración se guardan correctamente
   4. Verificar que añadir un nuevo servicio en Sanity y hacer rebuild lo muestra en la web
   5. Probar formulario de contacto end-to-end
   6. Probar en Chrome DevTools: mobile 375px, tablet 768px, desktop 1280px
   7. Verificar que no hay imágenes sin alt
   8. Verificar que el banner de cookies funciona y persiste en localStorage

── vercel.json (si es necesario)
   Configurar redirects si se necesitan (ej: /blog → /conocimiento)
   Headers de seguridad: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

── README.md en la raíz del proyecto
   Instrucciones de:
   - Instalación y desarrollo local
   - Configuración de variables de entorno
   - Cómo acceder al panel Sanity (/studio)
   - Cómo hacer deploy en Vercel
   - Estructura de carpetas

Resultado esperado: `pnpm build` pasa sin errores. El proyecto está listo para
conectar un proyecto real de Sanity y hacer deploy en Vercel.
Los datos de ejemplo están en Sanity y la web se ve completa y profesional.
```

---

## RESUMEN DE FASES

| Fase | Contenido | Resultado verificable |
|------|-----------|----------------------|
| 1 | Setup, dependencias, config | `pnpm dev` sin errores, /studio accesible |
| 2 | Schemas Sanity + Studio | Panel con 6 tipos de contenido |
| 3 | Header, Footer, layouts, nav mobile | Estructura visual base completa |
| 4 | Home completa (9 secciones) | Home editable 100% desde Sanity |
| 5 | Servicios, Sectores, Equipo | 3 secciones del menú con listados y detalle |
| 6 | Blog Conocimiento y Prensa | Paginación + filtros + detalle funcionando |
| 7 | Contacto + formulario + API Resend | Email recibido en CONTACT_EMAIL |
| 8 | SEO, performance, accesibilidad, GDPR | Lighthouse ≥ 95/95/100/95 |
| 9 | Legales, búsqueda, 404, pulido final | `pnpm build` sin errores, listo para Vercel |
