# Bufete Abogados — Web Corporativa

Sitio web corporativo para despacho de abogados. Diseño minimalista, responsivo y gestionable íntegramente desde un panel de administración propio con base de datos Turso (libSQL).

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Astro 5](https://astro.build) — SSR con adaptador Node.js standalone |
| Estilos | Tailwind CSS 3.4 |
| Interactividad | React 18 (islas: menú móvil, formulario de contacto, cookie banner) |
| Base de datos | [Turso](https://turso.tech) (libSQL) — SQL puro, sin ORM |
| Autenticación admin | JWT (`jose`) + bcrypt (`bcryptjs`) — cookie `httpOnly` |
| Contenido | Markdown renderizado con `marked` |
| Email | Resend API |
| Despliegue | [Railway](https://railway.app) — `railway.toml` incluido |

## Estructura del proyecto

```
src/
├── components/
│   ├── home/          # Secciones de la portada (Hero, About, Services, etc.)
│   ├── interactive/   # Islas React (ContactForm, MobileMenu, CookieBanner)
│   ├── layout/        # Header y Footer
│   └── ui/            # Componentes reutilizables (ServiceCard, Pagination…)
├── layouts/           # BaseLayout, PageLayout, ArticleLayout, AdminLayout
├── lib/
│   ├── db.ts          # Cliente Turso (process.env con fallback import.meta.env)
│   ├── auth.ts        # JWT + bcrypt
│   └── queries.ts     # Todas las consultas SQL
├── middleware.ts       # Protección de rutas /admin/*
└── pages/
    ├── admin/         # Panel de administración (CRUD completo)
    ├── servicios/     # Áreas de práctica
    ├── sectores/      # Sectores de actividad
    ├── equipo/        # Perfiles del equipo
    ├── conocimiento/  # Artículos / blog con paginación
    └── prensa/        # Noticias
scripts/
├── migrate.sql        # Esquema completo de la base de datos
├── setup.mjs          # Crea tablas y usuario admin inicial
└── seed.mjs           # Puebla la BD con contenido de ejemplo
railway.toml           # Configuración de build y start para Railway
```

## Variables de entorno

Crea un archivo `.env` en la raíz (o configúralas en el panel de Railway):

```env
TURSO_DATABASE_URL=libsql://tu-base.turso.io
TURSO_AUTH_TOKEN=tu_token_de_turso

# Genera con: node -e "const {randomBytes}=require('crypto');console.log(randomBytes(32).toString('base64url'))"
JWT_SECRET=cadena_aleatoria_segura_minimo_32_caracteres

# Opcional — formulario de contacto
RESEND_API_KEY=tu_api_key_de_resend
CONTACT_EMAIL=tu_email_de_destino
```

> **Importante:** `JWT_SECRET` debe tener al menos 32 caracteres. Genera siempre un valor aleatorio real para producción.

## Instalación y desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear tablas e insertar usuario admin en Turso
npm run setup

# 3. (Opcional) Poblar con contenido de ejemplo
npm run seed

# 4. Servidor de desarrollo
npm run dev
```

El setup crea las tablas necesarias en Turso e inserta un usuario administrador por defecto:

| Campo | Valor |
|---|---|
| Email | `admin@bufete.com` |
| Contraseña | `admin` |

**Cambia la contraseña antes de desplegar en producción.**

## Despliegue en Railway

```bash
# Compilar y arrancar (Railway lo hace automáticamente al hacer push)
npm run build
npm start
```

Railway detecta el `railway.toml` incluido y configura el build y start automáticamente. El servidor escucha en el puerto que Railway asigna mediante la variable `PORT`.

**Variables requeridas en Railway** (panel → Variables):
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `JWT_SECRET`

## Panel de administración

Accesible en `/admin/login`. Permite gestionar:

- **Configuración** — textos del hero, secciones destacadas, SEO global, badges de reconocimientos
- **Servicios** — áreas de práctica con slug, descripción y contenido markdown
- **Sectores** — sectores de actividad
- **Equipo** — perfiles de abogados con foto, bio, especialidades e idiomas
- **Artículos** — blog de conocimiento con categorías y paginación
- **Noticias** — sala de prensa

El panel es completamente responsivo: menú lateral con slide-in en móvil, tablas con scroll horizontal independiente y botón "Nuevo" siempre visible.

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
