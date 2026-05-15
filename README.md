# Bufete Abogados — Web Corporativa

Sitio web corporativo para despacho de abogados. Diseño minimalista, gestión de contenidos mediante panel de administración propio y base de datos Turso (libSQL).

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Astro 5](https://astro.build) — SSR con adaptador Node.js |
| Estilos | Tailwind CSS 3.4 |
| Interactividad | React 18 (islas) |
| Base de datos | [Turso](https://turso.tech) (libSQL) — SQL puro, sin ORM |
| Autenticación admin | JWT (`jose`) + bcrypt (`bcryptjs`) — cookie httpOnly |
| Contenido | Markdown renderizado con `marked` |
| Email | Resend API |
| Despliegue | Railway (Node.js standalone) |

## Estructura del proyecto

```
src/
├── components/
│   ├── home/          # Secciones de la portada
│   ├── interactive/   # Islas React (ContactForm, MobileMenu, CookieBanner)
│   ├── layout/        # Header y Footer
│   └── ui/            # Componentes reutilizables
├── layouts/           # BaseLayout, PageLayout, ArticleLayout, AdminLayout
├── lib/
│   ├── db.ts          # Cliente Turso
│   ├── auth.ts        # JWT + bcrypt
│   └── queries.ts     # Todas las consultas SQL
├── middleware.ts       # Protección de rutas /admin/*
└── pages/
    ├── admin/         # Panel de administración (CRUD completo)
    ├── servicios/     # Áreas de práctica
    ├── sectores/      # Sectores de actividad
    ├── equipo/        # Perfiles del equipo
    ├── conocimiento/  # Artículos / blog
    └── prensa/        # Noticias
scripts/
├── migrate.sql        # Esquema de base de datos
└── setup.mjs          # Crea tablas y usuario admin inicial
```

## Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
TURSO_DATABASE_URL=libsql://tu-base.turso.io
TURSO_AUTH_TOKEN=tu_token_de_turso
JWT_SECRET=cadena_aleatoria_segura_minimo_32_caracteres
RESEND_API_KEY=tu_api_key_de_resend
```

> **Importante:** en producción genera `JWT_SECRET` con un valor aleatorio seguro (mínimo 32 caracteres). Nunca uses el valor de ejemplo en producción.

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Crear tablas y usuario admin en Turso
npm run setup

# Servidor de desarrollo
npm run dev
```

El setup crea las tablas necesarias en Turso e inserta un usuario administrador por defecto:

- **Email:** `admin@bufete.com`
- **Contraseña:** `admin123`

**Cambia la contraseña desde el panel de administración antes de desplegar en producción.**

## Producción

```bash
# Compilar
npm run build

# Arrancar el servidor
npm start
```

El servidor escucha en el puerto definido por la variable de entorno `PORT` (Railway lo asigna automáticamente).

## Panel de administración

Accesible en `/admin/login`. Permite gestionar:

- **Configuración** — textos del hero, secciones destacadas, SEO global
- **Servicios** — áreas de práctica con slug, descripción y contenido markdown
- **Sectores** — sectores de actividad
- **Equipo** — perfiles de abogados con foto, bio y datos de contacto
- **Artículos** — blog de conocimiento con categorías
- **Noticias** — sala de prensa

## Despliegue en Railway

1. Sube el repositorio a GitHub
2. Crea un nuevo proyecto en Railway desde ese repositorio
3. Configura las variables de entorno en el dashboard de Railway
4. Railway detecta automáticamente los scripts `build` y `start` del `package.json`

## Base de datos

El esquema completo está en `scripts/migrate.sql`. Las tablas principales son:

- `configuracion` — singleton con todos los ajustes del sitio
- `servicios`, `sectores`, `miembros`, `articulos`, `noticias` — contenido
- `usuarios` — credenciales del panel de administración
