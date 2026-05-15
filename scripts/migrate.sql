-- ============================================================
-- BUFETE WEB — Migración inicial Turso/libSQL
-- ============================================================

CREATE TABLE IF NOT EXISTS configuracion (
  id INTEGER PRIMARY KEY DEFAULT 1,
  nombre_sitio TEXT DEFAULT 'Despacho de Abogados',
  logo_url TEXT,
  hero_titulo TEXT DEFAULT 'Derecho. Excelencia. Confianza.',
  hero_subtitulos TEXT DEFAULT '["Especialistas en derecho empresarial"]',
  hero_descripcion TEXT,
  hero_cta_texto TEXT DEFAULT 'Consultar con el despacho',
  hero_cta_enlace TEXT DEFAULT '/contacto',
  hero_imagen_url TEXT,
  sobre_titulo TEXT,
  sobre_contenido TEXT,
  sobre_imagen_url TEXT,
  sobre_cta_texto TEXT DEFAULT 'Conocer el equipo',
  sobre_cta_enlace TEXT DEFAULT '/equipo',
  servicios_titulo TEXT DEFAULT 'Áreas de práctica',
  sectores_titulo TEXT DEFAULT 'Sectores de actividad',
  equipo_titulo TEXT DEFAULT 'Nuestro equipo',
  reconocimientos_titulo TEXT DEFAULT 'Reconocimientos',
  badges TEXT DEFAULT '[]',
  cta_titulo TEXT DEFAULT '¿Necesita asesoramiento jurídico?',
  cta_subtitulo TEXT,
  cta_boton1_texto TEXT DEFAULT 'Contactar',
  cta_boton1_enlace TEXT DEFAULT '/contacto',
  cta_boton2_texto TEXT DEFAULT 'Conocer el equipo',
  cta_boton2_enlace TEXT DEFAULT '/equipo',
  linkedin TEXT,
  instagram TEXT,
  twitter TEXT,
  footer_texto TEXT,
  seo_titulo TEXT,
  seo_descripcion TEXT,
  seo_imagen_url TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO configuracion (id) VALUES (1);

CREATE TABLE IF NOT EXISTS servicios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion_corta TEXT,
  icono TEXT,
  imagen_url TEXT,
  contenido TEXT,
  orden INTEGER DEFAULT 0,
  destacado INTEGER DEFAULT 0,
  seo_titulo TEXT,
  seo_descripcion TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sectores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion_corta TEXT,
  imagen_url TEXT,
  color_acento TEXT DEFAULT '#C9A84C',
  contenido TEXT,
  orden INTEGER DEFAULT 0,
  seo_titulo TEXT,
  seo_descripcion TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS miembros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cargo TEXT,
  categoria TEXT DEFAULT 'asociado',
  foto_url TEXT,
  email TEXT,
  linkedin TEXT,
  resumen_corto TEXT,
  biografia TEXT,
  especialidades TEXT DEFAULT '[]',
  idiomas TEXT DEFAULT '[]',
  educacion TEXT DEFAULT '[]',
  orden INTEGER DEFAULT 0,
  mostrar_en_home INTEGER DEFAULT 0,
  activo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articulos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  publicado INTEGER DEFAULT 0,
  fecha_publicacion TEXT DEFAULT (date('now')),
  autor_id INTEGER REFERENCES miembros(id) ON DELETE SET NULL,
  categorias TEXT DEFAULT '[]',
  etiquetas TEXT DEFAULT '[]',
  imagen_url TEXT,
  imagen_alt TEXT,
  extracto TEXT,
  contenido TEXT,
  articulos_relacionados TEXT DEFAULT '[]',
  seo_titulo TEXT,
  seo_descripcion TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS noticias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  publicado INTEGER DEFAULT 0,
  fecha_publicacion TEXT DEFAULT (date('now')),
  fuente_externa TEXT,
  enlace_externo TEXT,
  imagen_url TEXT,
  imagen_alt TEXT,
  extracto TEXT,
  contenido TEXT,
  noticias_relacionadas TEXT DEFAULT '[]',
  seo_titulo TEXT,
  seo_descripcion TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT,
  activo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
