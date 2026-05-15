import { db } from './db';
import type { Row } from '@libsql/client';

const PER_PAGE = 9;

// ── helpers ────────────────────────────────────────────────────────────────
function row(r: Row): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key of Object.keys(r)) {
    const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    const val = (r as any)[key];
    if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
      try { out[camel] = JSON.parse(val); continue; } catch { /* fall through */ }
    }
    out[camel] = val;
  }
  return out;
}
function rows(rs: Row[]): Record<string, any>[] { return rs.map(row); }

// ── CONFIGURACIÓN ──────────────────────────────────────────────────────────
export async function getConfiguracion() {
  const { rows: rs } = await db.execute('SELECT * FROM configuracion WHERE id = 1');
  return rs[0] ? row(rs[0]) : null;
}

export async function updateConfiguracion(data: Record<string, any>) {
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  await db.execute({ sql: `UPDATE configuracion SET ${fields}, updated_at = datetime('now') WHERE id = 1`, args: Object.values(data) });
}

// ── SERVICIOS ──────────────────────────────────────────────────────────────
export async function getAllServicios() {
  const { rows: rs } = await db.execute('SELECT id, titulo, slug, descripcion_corta, icono, imagen_url FROM servicios ORDER BY orden ASC');
  return rows(rs);
}

export async function getServicioBySlug(slug: string) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM servicios WHERE slug = ?', args: [slug] });
  return rs[0] ? row(rs[0]) : null;
}

export async function getServicioById(id: number) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM servicios WHERE id = ?', args: [id] });
  return rs[0] ? row(rs[0]) : null;
}

export async function createServicio(data: Record<string, any>) {
  const { lastInsertRowid } = await db.execute({
    sql: `INSERT INTO servicios (titulo,slug,descripcion_corta,icono,imagen_url,contenido,orden,destacado,seo_titulo,seo_descripcion) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    args: [data.titulo, data.slug, data.descripcionCorta ?? '', data.icono ?? '', data.imagenUrl ?? '', data.contenido ?? '', data.orden ?? 0, data.destacado ? 1 : 0, data.seoTitulo ?? '', data.seoDescripcion ?? ''],
  });
  return Number(lastInsertRowid);
}

export async function updateServicio(id: number, data: Record<string, any>) {
  await db.execute({
    sql: `UPDATE servicios SET titulo=?,slug=?,descripcion_corta=?,icono=?,imagen_url=?,contenido=?,orden=?,destacado=?,seo_titulo=?,seo_descripcion=?,updated_at=datetime('now') WHERE id=?`,
    args: [data.titulo, data.slug, data.descripcionCorta ?? '', data.icono ?? '', data.imagenUrl ?? '', data.contenido ?? '', data.orden ?? 0, data.destacado ? 1 : 0, data.seoTitulo ?? '', data.seoDescripcion ?? '', id],
  });
}

export async function deleteServicio(id: number) {
  await db.execute({ sql: 'DELETE FROM servicios WHERE id = ?', args: [id] });
}

// ── SECTORES ───────────────────────────────────────────────────────────────
export async function getAllSectores() {
  const { rows: rs } = await db.execute('SELECT id, titulo, slug, descripcion_corta, imagen_url, color_acento FROM sectores ORDER BY orden ASC');
  return rows(rs);
}

export async function getSectorBySlug(slug: string) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM sectores WHERE slug = ?', args: [slug] });
  return rs[0] ? row(rs[0]) : null;
}

export async function getSectorById(id: number) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM sectores WHERE id = ?', args: [id] });
  return rs[0] ? row(rs[0]) : null;
}

export async function createSector(data: Record<string, any>) {
  const { lastInsertRowid } = await db.execute({
    sql: `INSERT INTO sectores (titulo,slug,descripcion_corta,imagen_url,color_acento,contenido,orden,seo_titulo,seo_descripcion) VALUES (?,?,?,?,?,?,?,?,?)`,
    args: [data.titulo, data.slug, data.descripcionCorta ?? '', data.imagenUrl ?? '', data.colorAccento ?? '#C9A84C', data.contenido ?? '', data.orden ?? 0, data.seoTitulo ?? '', data.seoDescripcion ?? ''],
  });
  return Number(lastInsertRowid);
}

export async function updateSector(id: number, data: Record<string, any>) {
  await db.execute({
    sql: `UPDATE sectores SET titulo=?,slug=?,descripcion_corta=?,imagen_url=?,color_acento=?,contenido=?,orden=?,seo_titulo=?,seo_descripcion=?,updated_at=datetime('now') WHERE id=?`,
    args: [data.titulo, data.slug, data.descripcionCorta ?? '', data.imagenUrl ?? '', data.colorAccento ?? '#C9A84C', data.contenido ?? '', data.orden ?? 0, data.seoTitulo ?? '', data.seoDescripcion ?? '', id],
  });
}

export async function deleteSector(id: number) {
  await db.execute({ sql: 'DELETE FROM sectores WHERE id = ?', args: [id] });
}

// ── EQUIPO ─────────────────────────────────────────────────────────────────
export async function getAllMiembros() {
  const { rows: rs } = await db.execute(
    'SELECT id,nombre,slug,cargo,categoria,foto_url,especialidades,idiomas,activo FROM miembros WHERE activo=1 ORDER BY categoria ASC,orden ASC'
  );
  return rows(rs);
}

export async function getAllMiembrosAdmin() {
  const { rows: rs } = await db.execute('SELECT id,nombre,slug,cargo,categoria,activo,orden FROM miembros ORDER BY categoria ASC,orden ASC');
  return rows(rs);
}

export async function getMiembroBySlug(slug: string) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM miembros WHERE slug = ?', args: [slug] });
  return rs[0] ? row(rs[0]) : null;
}

export async function getMiembroById(id: number) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM miembros WHERE id = ?', args: [id] });
  return rs[0] ? row(rs[0]) : null;
}

export async function createMiembro(data: Record<string, any>) {
  const { lastInsertRowid } = await db.execute({
    sql: `INSERT INTO miembros (nombre,slug,cargo,categoria,foto_url,email,linkedin,resumen_corto,biografia,especialidades,idiomas,educacion,orden,mostrar_en_home,activo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [data.nombre, data.slug, data.cargo ?? '', data.categoria ?? 'asociado', data.fotoUrl ?? '', data.email ?? '', data.linkedin ?? '', data.resumenCorto ?? '', data.biografia ?? '', JSON.stringify(data.especialidades ?? []), JSON.stringify(data.idiomas ?? []), JSON.stringify(data.educacion ?? []), data.orden ?? 0, data.mostrarEnHome ? 1 : 0, data.activo !== false ? 1 : 0],
  });
  return Number(lastInsertRowid);
}

export async function updateMiembro(id: number, data: Record<string, any>) {
  await db.execute({
    sql: `UPDATE miembros SET nombre=?,slug=?,cargo=?,categoria=?,foto_url=?,email=?,linkedin=?,resumen_corto=?,biografia=?,especialidades=?,idiomas=?,educacion=?,orden=?,mostrar_en_home=?,activo=?,updated_at=datetime('now') WHERE id=?`,
    args: [data.nombre, data.slug, data.cargo ?? '', data.categoria ?? 'asociado', data.fotoUrl ?? '', data.email ?? '', data.linkedin ?? '', data.resumenCorto ?? '', data.biografia ?? '', JSON.stringify(data.especialidades ?? []), JSON.stringify(data.idiomas ?? []), JSON.stringify(data.educacion ?? []), data.orden ?? 0, data.mostrarEnHome ? 1 : 0, data.activo !== false ? 1 : 0, id],
  });
}

export async function deleteMiembro(id: number) {
  await db.execute({ sql: 'DELETE FROM miembros WHERE id = ?', args: [id] });
}

// ── ARTÍCULOS ──────────────────────────────────────────────────────────────
export async function getArticulos(page = 1, categoria?: string) {
  const start = (page - 1) * PER_PAGE;
  const [countRes, dataRes] = await Promise.all([
    db.execute(categoria
      ? { sql: `SELECT COUNT(DISTINCT a.id) as total FROM articulos a,json_each(a.categorias) WHERE a.publicado=1 AND json_each.value=?`, args: [categoria] }
      : `SELECT COUNT(*) as total FROM articulos WHERE publicado=1`),
    db.execute(categoria
      ? { sql: `SELECT a.id,a.titulo,a.slug,a.fecha_publicacion,a.categorias,a.extracto,a.imagen_url,m.nombre as autor_nombre FROM articulos a LEFT JOIN miembros m ON a.autor_id=m.id,json_each(a.categorias) WHERE a.publicado=1 AND json_each.value=? GROUP BY a.id ORDER BY a.fecha_publicacion DESC LIMIT ${PER_PAGE} OFFSET ${start}`, args: [categoria] }
      : { sql: `SELECT a.id,a.titulo,a.slug,a.fecha_publicacion,a.categorias,a.extracto,a.imagen_url,m.nombre as autor_nombre FROM articulos a LEFT JOIN miembros m ON a.autor_id=m.id WHERE a.publicado=1 ORDER BY a.fecha_publicacion DESC LIMIT ${PER_PAGE} OFFSET ${start}`, args: [] }),
  ]);
  const total = Number((countRes.rows[0] as any)?.total ?? 0);
  return { items: rows(dataRes.rows), total, totalPages: Math.ceil(total / PER_PAGE), currentPage: page };
}

export async function getArticuloBySlug(slug: string) {
  const { rows: rs } = await db.execute({
    sql: `SELECT a.*,m.nombre as autor_nombre,m.slug as autor_slug,m.cargo as autor_cargo,m.foto_url as autor_foto_url FROM articulos a LEFT JOIN miembros m ON a.autor_id=m.id WHERE a.slug=? AND a.publicado=1`,
    args: [slug],
  });
  return rs[0] ? row(rs[0]) : null;
}

export async function getArticuloById(id: number) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM articulos WHERE id = ?', args: [id] });
  return rs[0] ? row(rs[0]) : null;
}

export async function getAllArticulos() {
  const { rows: rs } = await db.execute('SELECT id,titulo,slug,publicado,fecha_publicacion FROM articulos ORDER BY fecha_publicacion DESC');
  return rows(rs);
}

export async function getArticulosRecientes(n = 3) {
  const { rows: rs } = await db.execute({
    sql: `SELECT a.titulo,a.slug,a.fecha_publicacion,a.categorias,a.extracto,a.imagen_url,m.nombre as autor_nombre FROM articulos a LEFT JOIN miembros m ON a.autor_id=m.id WHERE a.publicado=1 ORDER BY a.fecha_publicacion DESC LIMIT ?`,
    args: [n],
  });
  return rows(rs);
}

export async function getCategorias(): Promise<string[]> {
  const { rows: rs } = await db.execute(
    `SELECT DISTINCT json_each.value as categoria FROM articulos,json_each(categorias) WHERE publicado=1 ORDER BY categoria ASC`
  );
  return rs.map((r: any) => r.categoria as string).filter(Boolean);
}

export async function createArticulo(data: Record<string, any>) {
  const { lastInsertRowid } = await db.execute({
    sql: `INSERT INTO articulos (titulo,slug,publicado,fecha_publicacion,autor_id,categorias,etiquetas,imagen_url,imagen_alt,extracto,contenido,seo_titulo,seo_descripcion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [data.titulo, data.slug, data.publicado ? 1 : 0, data.fechaPublicacion || new Date().toISOString().split('T')[0], data.autorId || null, JSON.stringify(data.categorias ?? []), JSON.stringify(data.etiquetas ?? []), data.imagenUrl ?? '', data.imagenAlt ?? '', data.extracto ?? '', data.contenido ?? '', data.seoTitulo ?? '', data.seoDescripcion ?? ''],
  });
  return Number(lastInsertRowid);
}

export async function updateArticulo(id: number, data: Record<string, any>) {
  await db.execute({
    sql: `UPDATE articulos SET titulo=?,slug=?,publicado=?,fecha_publicacion=?,autor_id=?,categorias=?,etiquetas=?,imagen_url=?,imagen_alt=?,extracto=?,contenido=?,seo_titulo=?,seo_descripcion=?,updated_at=datetime('now') WHERE id=?`,
    args: [data.titulo, data.slug, data.publicado ? 1 : 0, data.fechaPublicacion, data.autorId || null, JSON.stringify(data.categorias ?? []), JSON.stringify(data.etiquetas ?? []), data.imagenUrl ?? '', data.imagenAlt ?? '', data.extracto ?? '', data.contenido ?? '', data.seoTitulo ?? '', data.seoDescripcion ?? '', id],
  });
}

export async function deleteArticulo(id: number) {
  await db.execute({ sql: 'DELETE FROM articulos WHERE id = ?', args: [id] });
}

// ── NOTICIAS ───────────────────────────────────────────────────────────────
export async function getNoticias(page = 1) {
  const start = (page - 1) * PER_PAGE;
  const [countRes, dataRes] = await Promise.all([
    db.execute('SELECT COUNT(*) as total FROM noticias WHERE publicado=1'),
    db.execute({ sql: `SELECT id,titulo,slug,fecha_publicacion,fuente_externa,enlace_externo,extracto,imagen_url FROM noticias WHERE publicado=1 ORDER BY fecha_publicacion DESC LIMIT ${PER_PAGE} OFFSET ${start}`, args: [] }),
  ]);
  const total = Number((countRes.rows[0] as any)?.total ?? 0);
  return { items: rows(dataRes.rows), total, totalPages: Math.ceil(total / PER_PAGE), currentPage: page };
}

export async function getNoticiaBySlug(slug: string) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM noticias WHERE slug=? AND publicado=1', args: [slug] });
  return rs[0] ? row(rs[0]) : null;
}

export async function getNoticiaById(id: number) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM noticias WHERE id=?', args: [id] });
  return rs[0] ? row(rs[0]) : null;
}

export async function getAllNoticias() {
  const { rows: rs } = await db.execute('SELECT id,titulo,slug,publicado,fecha_publicacion FROM noticias ORDER BY fecha_publicacion DESC');
  return rows(rs);
}

export async function createNoticia(data: Record<string, any>) {
  const { lastInsertRowid } = await db.execute({
    sql: `INSERT INTO noticias (titulo,slug,publicado,fecha_publicacion,fuente_externa,enlace_externo,imagen_url,imagen_alt,extracto,contenido,seo_titulo,seo_descripcion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [data.titulo, data.slug, data.publicado ? 1 : 0, data.fechaPublicacion || new Date().toISOString().split('T')[0], data.fuenteExterna ?? '', data.enlaceExterno ?? '', data.imagenUrl ?? '', data.imagenAlt ?? '', data.extracto ?? '', data.contenido ?? '', data.seoTitulo ?? '', data.seoDescripcion ?? ''],
  });
  return Number(lastInsertRowid);
}

export async function updateNoticia(id: number, data: Record<string, any>) {
  await db.execute({
    sql: `UPDATE noticias SET titulo=?,slug=?,publicado=?,fecha_publicacion=?,fuente_externa=?,enlace_externo=?,imagen_url=?,imagen_alt=?,extracto=?,contenido=?,seo_titulo=?,seo_descripcion=?,updated_at=datetime('now') WHERE id=?`,
    args: [data.titulo, data.slug, data.publicado ? 1 : 0, data.fechaPublicacion, data.fuenteExterna ?? '', data.enlaceExterno ?? '', data.imagenUrl ?? '', data.imagenAlt ?? '', data.extracto ?? '', data.contenido ?? '', data.seoTitulo ?? '', data.seoDescripcion ?? '', id],
  });
}

export async function deleteNoticia(id: number) {
  await db.execute({ sql: 'DELETE FROM noticias WHERE id = ?', args: [id] });
}

// ── DESTACADOS HOME ────────────────────────────────────────────────────────
export async function getServiciosDestacados(limit = 3) {
  const { rows: rs } = await db.execute({
    sql: 'SELECT id,titulo,slug,descripcion_corta,icono,imagen_url FROM servicios WHERE destacado=1 ORDER BY orden ASC LIMIT ?',
    args: [limit],
  });
  return rows(rs);
}

export async function getSectoresDestacados(limit = 3) {
  const { rows: rs } = await db.execute({
    sql: 'SELECT id,titulo,slug,descripcion_corta,imagen_url,color_acento FROM sectores ORDER BY orden ASC LIMIT ?',
    args: [limit],
  });
  return rows(rs);
}

export async function getEquipoDestacado(limit = 3) {
  const { rows: rs } = await db.execute({
    sql: 'SELECT id,nombre,slug,cargo,categoria,foto_url,especialidades FROM miembros WHERE mostrar_en_home=1 AND activo=1 ORDER BY orden ASC LIMIT ?',
    args: [limit],
  });
  return rows(rs);
}

// ── USUARIOS ───────────────────────────────────────────────────────────────
export async function getUserByEmail(email: string) {
  const { rows: rs } = await db.execute({ sql: 'SELECT * FROM usuarios WHERE email=? AND activo=1', args: [email] });
  return rs[0] ? row(rs[0]) : null;
}

export async function updateUserPassword(id: number, hash: string) {
  await db.execute({ sql: 'UPDATE usuarios SET password_hash=? WHERE id=?', args: [hash, id] });
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
export async function getFooterData() {
  const [sRes, secRes, cRes] = await Promise.all([
    db.execute('SELECT titulo,slug FROM servicios ORDER BY orden ASC LIMIT 6'),
    db.execute('SELECT titulo,slug FROM sectores ORDER BY orden ASC LIMIT 6'),
    db.execute('SELECT nombre_sitio,footer_texto,linkedin,instagram,twitter,logo_url FROM configuracion WHERE id=1'),
  ]);
  return { servicios: rows(sRes.rows), sectores: rows(secRes.rows), config: cRes.rows[0] ? row(cRes.rows[0]) : null };
}

