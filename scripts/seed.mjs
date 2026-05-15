/**
 * Seed de contenido de ejemplo para Bufete Nico
 * Ejecutar: node scripts/seed.mjs
 */

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

try {
  const envContent = readFileSync(join(__dir, '../.env'), 'utf-8');
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch { /* usa variables del sistema */ }

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ─────────────────────────────────────────────
// AGREGAR COLUMNAS DESTACADOS SI NO EXISTEN
// ─────────────────────────────────────────────
console.log('🔧  Verificando columnas de destacados...');
const alters = [
  "ALTER TABLE configuracion ADD COLUMN servicios_destacados TEXT DEFAULT '[]'",
  "ALTER TABLE configuracion ADD COLUMN sectores_destacados TEXT DEFAULT '[]'",
  "ALTER TABLE configuracion ADD COLUMN equipo_destacado TEXT DEFAULT '[]'",
];
for (const sql of alters) {
  try { await db.execute(sql); } catch { /* columna ya existe */ }
}

// ─────────────────────────────────────────────
// CONFIGURACIÓN GENERAL
// ─────────────────────────────────────────────
console.log('⚙️  Configuración general...');
await db.execute({
  sql: `UPDATE configuracion SET
    nombre_sitio = ?,
    hero_titulo = ?,
    hero_subtitulos = ?,
    hero_descripcion = ?,
    hero_cta_texto = ?,
    hero_cta_enlace = ?,
    sobre_titulo = ?,
    sobre_contenido = ?,
    sobre_cta_texto = ?,
    sobre_cta_enlace = ?,
    servicios_titulo = ?,
    sectores_titulo = ?,
    equipo_titulo = ?,
    reconocimientos_titulo = ?,
    badges = ?,
    cta_titulo = ?,
    cta_subtitulo = ?,
    cta_boton1_texto = ?,
    cta_boton1_enlace = ?,
    cta_boton2_texto = ?,
    cta_boton2_enlace = ?,
    footer_texto = ?,
    seo_titulo = ?,
    seo_descripcion = ?
    WHERE id = 1`,
  args: [
    'Martínez & Asociados',
    'Derecho. Estrategia. Resultados.',
    JSON.stringify([
      'Asesoramiento jurídico de alto nivel',
      'Especialistas en derecho empresarial e internacional',
      'Más de 20 años defendiendo sus intereses',
    ]),
    'Despacho de abogados con vocación de excelencia. Ofrecemos soluciones jurídicas precisas, estratégicas y adaptadas a la realidad de cada cliente.',
    'Consultar con el despacho',
    '/contacto',
    'Un despacho fundado en la excelencia',
    `Martínez & Asociados nació en 2003 con una premisa clara: ofrecer asesoramiento jurídico de la más alta calidad a empresas e instituciones que exigen resultados.

Desde nuestra fundación hemos gestionado más de 1.200 asuntos, representado a clientes en 14 países y consolidado un equipo de abogados especializados en las áreas más exigentes del derecho moderno.

Nuestra forma de trabajar combina el rigor técnico con una visión estratégica del negocio. Entendemos que cada decisión jurídica tiene consecuencias económicas, por eso actuamos como socios de confianza, no solo como asesores legales.`,
    'Conocer el equipo',
    '/equipo',
    'Áreas de práctica',
    'Sectores de actividad',
    'Nuestro equipo',
    'Reconocimientos',
    JSON.stringify([
      { texto: 'Chambers Europe 2024', descripcion: 'Band 1 · Derecho Corporativo' },
      { texto: 'Legal 500 EMEA', descripcion: 'Tier 1 · M&A y Private Equity' },
      { texto: 'Best Lawyers 2024', descripcion: '12 socios reconocidos' },
      { texto: 'IFLR1000', descripcion: 'Highly Regarded · Finance' },
    ]),
    '¿Necesita asesoramiento jurídico?',
    'Póngase en contacto con nuestro equipo. Le respondemos en menos de 24 horas.',
    'Solicitar consulta',
    '/contacto',
    'Ver el equipo',
    '/equipo',
    '© 2024 Martínez & Asociados. Todos los derechos reservados.',
    'Martínez & Asociados — Abogados',
    'Despacho de abogados especializado en derecho empresarial, fusiones y adquisiciones, derecho fiscal y litigación internacional.',
  ],
});

// ─────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────
console.log('📋  Servicios...');
const servicios = [
  {
    titulo: 'Derecho Corporativo y M&A',
    slug: 'derecho-corporativo-ma',
    descripcion_corta: 'Asesoramiento integral en operaciones de fusiones, adquisiciones, reestructuraciones y gobierno corporativo.',
    contenido: `## Asesoramiento corporativo de primer nivel

Nuestro equipo de derecho corporativo acompaña a empresas en todas las fases de su ciclo de vida: desde la constitución y estructuración hasta las operaciones más complejas de fusiones y adquisiciones.

### Qué ofrecemos

- **Due diligence** legal completa en operaciones de compraventa de empresas
- Estructuración y negociación de contratos de compraventa de acciones y activos
- Asesoramiento en operaciones de **private equity y venture capital**
- Gobierno corporativo y cumplimiento normativo
- Reestructuraciones societarias y escisiones
- Joint ventures y alianzas estratégicas

### Nuestra experiencia

Hemos asesorado en más de 200 operaciones de M&A, con un volumen agregado superior a 4.000 millones de euros. Trabajamos con fondos de inversión, multinacionales y empresas familiares en procesos de expansión o desinversión.`,
    orden: 1,
    destacado: 1,
  },
  {
    titulo: 'Derecho Fiscal',
    slug: 'derecho-fiscal',
    descripcion_corta: 'Planificación fiscal, cumplimiento tributario y defensa ante la Administración y los tribunales.',
    contenido: `## Fiscalidad empresarial y personal

El área fiscal de Martínez & Asociados ofrece un servicio integral que cubre tanto la planificación preventiva como la defensa contenciosa frente a la Administración Tributaria.

### Servicios

- Planificación fiscal nacional e internacional
- Reestructuraciones empresariales con eficiencia fiscal
- **Precios de transferencia** y operaciones vinculadas
- Inspecciones y procedimientos tributarios
- Recursos ante el TEAC y tribunales contencioso-administrativos
- Fiscalidad de **patrimonios personales** y sucesiones

### Enfoque

Entendemos la fiscalidad como una herramienta estratégica. Trabajamos de forma coordinada con el área corporativa y mercantil para que la estructura fiscal acompañe a los objetivos de negocio.`,
    orden: 2,
    destacado: 1,
  },
  {
    titulo: 'Litigación y Arbitraje',
    slug: 'litigacion-arbitraje',
    descripcion_corta: 'Defensa en procedimientos judiciales complejos y arbitrajes nacionales e internacionales.',
    contenido: `## Litigación estratégica

Nuestro equipo de litigación está formado por abogados con amplia experiencia en procedimientos complejos ante todos los órdenes jurisdiccionales y en los principales centros de arbitraje internacionales.

### Áreas de actuación

- Litigación **mercantil y societaria**: impugnación de acuerdos, responsabilidad de administradores, conflictos entre socios
- Arbitraje internacional (ICC, CIAR, LCIA)
- Reclamaciones contractuales de cuantía relevante
- Litigación **bancaria y financiera**
- Procedimientos concursales y pre-concursales
- Ejecución e impugnación de laudos arbitrales

### Resultados

Más de 95% de asuntos resueltos favorablemente en primera o segunda instancia durante los últimos 5 años.`,
    orden: 3,
    destacado: 1,
  },
  {
    titulo: 'Derecho Laboral',
    slug: 'derecho-laboral',
    descripcion_corta: 'Relaciones laborales, negociación colectiva, ERES y asesoramiento en recursos humanos.',
    contenido: `## Relaciones laborales y empleo

Asesoramos a empresas en la gestión de sus relaciones laborales, desde el diseño de la política de recursos humanos hasta la resolución de conflictos colectivos.

### Servicios principales

- Reestructuraciones de plantilla: EREs, ERTEs y despidos colectivos
- Negociación de **convenios colectivos**
- Contratos de alta dirección y pactos de no competencia
- Prevención de riesgos laborales y compliance
- Litigación laboral ante Juzgados y Tribunales
- Protocolos de acoso e igualdad`,
    orden: 4,
    destacado: 0,
  },
  {
    titulo: 'Derecho Inmobiliario',
    slug: 'derecho-inmobiliario',
    descripcion_corta: 'Transacciones inmobiliarias, due diligence, promoción y financiación de proyectos.',
    contenido: `## Inmobiliario y urbanismo

Asesoramos en todas las fases del negocio inmobiliario: adquisición, financiación, gestión, desarrollo y desinversión de activos.

### Qué hacemos

- Due diligence legal de activos inmobiliarios
- Compraventas de inmuebles y carteras de activos
- Financiación hipotecaria y estructurada
- **Promoción inmobiliaria** y gestión de suelo
- Arrendamientos comerciales y residenciales
- Gestión de conflictos arrendaticios`,
    orden: 5,
    destacado: 0,
  },
  {
    titulo: 'Derecho Concursal',
    slug: 'derecho-concursal',
    descripcion_corta: 'Reestructuración de deuda, acuerdos extrajudiciales y administración concursal.',
    contenido: `## Reestructuración e insolvencia

Cuando una empresa atraviesa dificultades financieras, la rapidez y la estrategia jurídica son determinantes. Nuestro equipo ofrece soluciones tanto preventivas como reactivas.

### Servicios

- Acuerdos de reestructuración extrajudicial
- Planes de reestructuración homologados judicialmente
- Concurso de acreedores: administración y defensa
- Reclamaciones de créditos concursales
- Responsabilidad de administradores en situación de insolvencia`,
    orden: 6,
    destacado: 0,
  },
];

for (const s of servicios) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO servicios (titulo, slug, descripcion_corta, contenido, orden, destacado)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [s.titulo, s.slug, s.descripcion_corta, s.contenido, s.orden, s.destacado],
  });
}

// ─────────────────────────────────────────────
// SECTORES
// ─────────────────────────────────────────────
console.log('🏭  Sectores...');
const sectores = [
  {
    titulo: 'Tecnología e Innovación',
    slug: 'tecnologia-innovacion',
    descripcion_corta: 'Asesoramiento jurídico especializado para empresas tecnológicas, startups y fondos de venture capital.',
    contenido: `## Derecho para el sector tecnológico

El ecosistema tecnológico tiene unas necesidades jurídicas propias. Acompañamos a startups, scale-ups y grandes empresas tecnológicas en todos los hitos de su crecimiento.

### Áreas de especialización

- Rondas de financiación y venture capital
- Protección de **propiedad intelectual e industrial**
- Contratos de desarrollo de software y SaaS
- Cumplimiento RGPD y privacidad de datos
- Salidas a bolsa y procesos de M&A tech`,
    orden: 1,
  },
  {
    titulo: 'Energía y Recursos Naturales',
    slug: 'energia-recursos-naturales',
    descripcion_corta: 'Proyectos de energías renovables, regulación del sector energético y financiación de infraestructuras.',
    contenido: `## Derecho energético

La transición energética genera oportunidades y complejidades regulatorias únicas. Nuestro equipo tiene una profunda experiencia en el sector.

### Qué hacemos

- Desarrollo y financiación de proyectos **fotovoltaicos y eólicos**
- Permisos y licencias administrativas
- Contratos de compraventa de energía (PPAs)
- Regulación del mercado eléctrico
- Fusiones y adquisiciones en el sector energético`,
    orden: 2,
  },
  {
    titulo: 'Banca y Mercados de Capitales',
    slug: 'banca-mercados-capitales',
    descripcion_corta: 'Financiación estructurada, regulación bancaria y operaciones en mercados de capitales.',
    contenido: `## Sector financiero y bancario

Asesoramos a entidades financieras, fondos de inversión y empresas en sus operaciones en los mercados de capitales y en el cumplimiento de la normativa bancaria.

### Servicios

- Financiación sindicada y estructurada
- Emisión de **bonos y titulizaciones**
- Regulación bancaria y supervisión
- Fondos de inversión y capital riesgo
- Derivados financieros y gestión de riesgos`,
    orden: 3,
  },
  {
    titulo: 'Inmobiliario y Construcción',
    slug: 'inmobiliario-construccion',
    descripcion_corta: 'Promotoras, fondos inmobiliarios, constructoras y gestoras de activos.',
    contenido: `## El sector inmobiliario, desde dentro

Conocemos la industria inmobiliaria en profundidad y ofrecemos asesoramiento integral a todos sus actores: promotores, inversores, gestoras y entidades financiadoras.

### Especialidades

- Carteras de activos residenciales y terciarios
- **Socimis y vehículos de inversión** inmobiliaria
- Contratos de obra y reclamaciones constructivas
- Urbanismo y gestión de suelo`,
    orden: 4,
  },
  {
    titulo: 'Farmacéutico y Ciencias de la Vida',
    slug: 'farmaceutico-ciencias-vida',
    descripcion_corta: 'Regulación sanitaria, patentes, licencias y operaciones corporativas en el sector salud.',
    contenido: `## Ciencias de la vida y salud

El sector farmacéutico y de ciencias de la vida combina una fuerte regulación con un dinamismo corporativo creciente. Nuestro equipo cuenta con especialistas en ambas vertientes.

### Áreas de actuación

- Registro y autorización de **medicamentos y dispositivos médicos**
- Patentes farmacéuticas y licencias
- Fusiones y adquisiciones en el sector salud
- Contratos de investigación clínica y colaboración
- Publicidad y promoción sanitaria`,
    orden: 5,
  },
  {
    titulo: 'Medios y Entretenimiento',
    slug: 'medios-entretenimiento',
    descripcion_corta: 'Propiedad intelectual, contratos de producción, distribución y licencias en la industria creativa.',
    contenido: `## Industria creativa y medios digitales

La economía creativa requiere una protección jurídica sofisticada. Asesoramos a productoras, sellos discográficos, plataformas digitales y creadores de contenido.

### Servicios

- Contratos de producción audiovisual y musical
- Licencias de derechos de autor y conexos
- Acuerdos con plataformas de **streaming y distribución**
- Patrocinio, publicidad y influencer marketing
- Protección de marca y nombres artísticos`,
    orden: 6,
  },
];

for (const s of sectores) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO sectores (titulo, slug, descripcion_corta, contenido, orden)
          VALUES (?, ?, ?, ?, ?)`,
    args: [s.titulo, s.slug, s.descripcion_corta, s.contenido, s.orden],
  });
}

// ─────────────────────────────────────────────
// EQUIPO
// ─────────────────────────────────────────────
console.log('👥  Equipo...');
const miembros = [
  {
    nombre: 'Nicolás Martínez Vidal',
    slug: 'nicolas-martinez-vidal',
    cargo: 'Socio Fundador',
    categoria: 'socio',
    email: 'n.martinez@bufete.com',
    resumen_corto: 'Fundador del despacho y referente en derecho corporativo y M&A con más de 25 años de experiencia.',
    biografia: `Nicolás Martínez fundó el despacho en 2003 tras una larga trayectoria en firmas internacionales de primer nivel en Madrid, Londres y Nueva York.

Es considerado uno de los principales expertos en operaciones de fusiones y adquisiciones del país. Ha liderado transacciones por valor superior a 8.000 millones de euros en sectores como tecnología, energía, infraestructuras y banca.

Ha sido reconocido de forma ininterrumpida desde 2010 en Chambers Europe (Band 1), Legal 500 y Best Lawyers. Es miembro del consejo asesor de varias compañías cotizadas y colabora habitualmente con el IESE Business School como profesor asociado.`,
    especialidades: JSON.stringify(['M&A y Private Equity', 'Derecho Corporativo', 'Gobierno Corporativo', 'Derecho Internacional']),
    idiomas: JSON.stringify(['Español', 'Inglés', 'Francés']),
    educacion: JSON.stringify([
      'Licenciado en Derecho — Universidad Complutense de Madrid',
      'LLM in Corporate Law — London School of Economics',
      'Máster en Fiscalidad Internacional — Instituto de Empresa',
    ]),
    orden: 1,
    mostrar_en_home: 1,
  },
  {
    nombre: 'Elena Casado Romero',
    slug: 'elena-casado-romero',
    cargo: 'Socia',
    categoria: 'socio',
    email: 'e.casado@bufete.com',
    resumen_corto: 'Socia responsable del área fiscal. Especialista en fiscalidad internacional y precios de transferencia.',
    biografia: `Elena Casado se incorporó al despacho en 2008 y es socia desde 2015. Dirige el área fiscal con especial foco en planificación internacional y operaciones transfronterizas.

Ha asesorado a grupos multinacionales en la estructuración de sus operaciones en más de 30 países, con especial atención a los mercados latinoamericanos y centroeuropeos.

Es autora de múltiples artículos en publicaciones jurídicas especializadas y ponente habitual en conferencias de fiscalidad internacional organizadas por la IFA y la OCDE.`,
    especialidades: JSON.stringify(['Fiscalidad Internacional', 'Precios de Transferencia', 'Reestructuraciones Fiscales', 'Patrimonio Personal']),
    idiomas: JSON.stringify(['Español', 'Inglés', 'Alemán']),
    educacion: JSON.stringify([
      'Licenciada en Derecho — Universidad de Navarra',
      'Máster en Asesoría Fiscal — CEF',
      'Postgrado en International Tax — Vienna University of Economics',
    ]),
    orden: 2,
    mostrar_en_home: 1,
  },
  {
    nombre: 'Javier Ortega Puente',
    slug: 'javier-ortega-puente',
    cargo: 'Socio',
    categoria: 'socio',
    email: 'j.ortega@bufete.com',
    resumen_corto: 'Responsable del área de litigación y arbitraje internacional. Más de 18 años en procedimientos complejos.',
    biografia: `Javier Ortega lidera el área de litigación del despacho desde 2012. Con formación en Londres y experiencia en arbitrajes ante la ICC, el CIADI y la CCI, es uno de los árbitros y abogados litigantes más reconocidos de España.

Ha defendido a clientes en procedimientos ante el Tribunal Supremo, la Audiencia Nacional y la Corte Internacional de Arbitraje en asuntos valorados en más de 2.000 millones de euros.

Es miembro del Club Español del Arbitraje y árbitro designado en numerosos paneles internacionales.`,
    especialidades: JSON.stringify(['Arbitraje Internacional', 'Litigación Mercantil', 'Responsabilidad de Administradores', 'Litigación Bancaria']),
    idiomas: JSON.stringify(['Español', 'Inglés', 'Italiano']),
    educacion: JSON.stringify([
      'Licenciado en Derecho — Universidad Carlos III de Madrid',
      'LLM in International Dispute Resolution — Queen Mary University of London',
    ]),
    orden: 3,
    mostrar_en_home: 1,
  },
  {
    nombre: 'Ana Blanco Ferreira',
    slug: 'ana-blanco-ferreira',
    cargo: 'Socia',
    categoria: 'socio',
    email: 'a.blanco@bufete.com',
    resumen_corto: 'Especialista en derecho laboral y relaciones colectivas. Asesora a grandes empresas en reestructuraciones de plantilla.',
    biografia: `Ana Blanco se incorporó al despacho en 2010 procedente de una firma internacional donde desarrolló su carrera en el área de empleo. Es socia desde 2018.

Asesora a empresas del Ibex 35 y multinacionales en negociaciones colectivas, EREs y en la gestión de relaciones con los sindicatos. Ha participado como experta en comisiones gubernamentales de reforma laboral.`,
    especialidades: JSON.stringify(['Derecho Laboral', 'Reestructuraciones de Plantilla', 'Negociación Colectiva', 'Igualdad y Diversidad']),
    idiomas: JSON.stringify(['Español', 'Inglés', 'Portugués']),
    educacion: JSON.stringify([
      'Licenciada en Derecho — Universidad de Santiago de Compostela',
      'Máster en Relaciones Laborales — ESADE',
    ]),
    orden: 4,
    mostrar_en_home: 0,
  },
  {
    nombre: 'Carlos Mendoza Ríos',
    slug: 'carlos-mendoza-rios',
    cargo: 'Asociado Senior',
    categoria: 'asociado',
    email: 'c.mendoza@bufete.com',
    resumen_corto: 'Asociado senior en el área corporativa, con foco en transacciones de private equity y venture capital.',
    biografia: `Carlos Mendoza forma parte del equipo corporativo desde 2016. Se incorporó al despacho tras pasar tres años en el departamento de M&A de un banco de inversión en Londres.

Especializado en transacciones de private equity y en la captación de financiación para startups tecnológicas, ha cerrado operaciones en los sectores de fintech, healthtech y cleantech.`,
    especialidades: JSON.stringify(['Private Equity', 'Venture Capital', 'Startups', 'Contratos Comerciales']),
    idiomas: JSON.stringify(['Español', 'Inglés']),
    educacion: JSON.stringify([
      'Doble Grado en Derecho y ADE — Universidad Pontificia Comillas (ICADE)',
      'LLM in Commercial Law — University College London',
    ]),
    orden: 5,
    mostrar_en_home: 0,
  },
  {
    nombre: 'Laura Sánchez Vega',
    slug: 'laura-sanchez-vega',
    cargo: 'Asociada Senior',
    categoria: 'asociado',
    email: 'l.sanchez@bufete.com',
    resumen_corto: 'Especialista en derecho inmobiliario y urbanismo. Asesora en carteras de activos y proyectos de desarrollo.',
    biografia: `Laura Sánchez se unió al despacho en 2018 y es actualmente asociada senior en el área inmobiliaria. Ha participado en la estructuración y cierre de transacciones de activos inmobiliarios por más de 1.500 millones de euros.

Su práctica combina el asesoramiento en transacciones con la gestión de conflictos arrendaticios y la regulación urbanística, con especial experiencia en el mercado residencial y logístico.`,
    especialidades: JSON.stringify(['Derecho Inmobiliario', 'Urbanismo', 'Arrendamientos Comerciales', 'SOCIMIs']),
    idiomas: JSON.stringify(['Español', 'Inglés', 'Francés']),
    educacion: JSON.stringify([
      'Licenciada en Derecho — Universidad Autónoma de Madrid',
      'Máster en Derecho Inmobiliario y Urbanismo — Universidad de Salamanca',
    ]),
    orden: 6,
    mostrar_en_home: 0,
  },
];

for (const m of miembros) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO miembros
          (nombre, slug, cargo, categoria, email, resumen_corto, biografia, especialidades, idiomas, educacion, orden, mostrar_en_home)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [m.nombre, m.slug, m.cargo, m.categoria, m.email, m.resumen_corto, m.biografia,
           m.especialidades, m.idiomas, m.educacion, m.orden, m.mostrar_en_home],
  });
}

// ─────────────────────────────────────────────
// ARTÍCULOS
// ─────────────────────────────────────────────
console.log('📝  Artículos...');
const articulos = [
  {
    titulo: 'La nueva regulación de la Inteligencia Artificial: implicaciones para las empresas',
    slug: 'regulacion-inteligencia-artificial-empresas',
    publicado: 1,
    fecha_publicacion: '2024-03-15',
    categorias: JSON.stringify(['Tecnología', 'Regulación']),
    extracto: 'El Reglamento Europeo de IA ya es una realidad. Analizamos las obligaciones que impone a las empresas que desarrollan o utilizan sistemas de inteligencia artificial.',
    contenido: `## El Reglamento Europeo de IA: una nueva era regulatoria

La aprobación del Reglamento Europeo de Inteligencia Artificial (AI Act) representa el cambio más significativo en la regulación tecnológica desde el RGPD. Su entrada en vigor plantea obligaciones concretas para empresas de todos los tamaños y sectores.

### Sistemas de alto riesgo: las obligaciones más exigentes

El reglamento clasifica los sistemas de IA en función del riesgo que representan. Los considerados de "alto riesgo" —que incluyen aplicaciones en RRHH, crédito bancario, educación o infraestructuras críticas— deben cumplir requisitos estrictos:

- **Documentación técnica** exhaustiva del sistema
- Registro de actividad (*logging*) para auditoría
- Supervisión humana efectiva
- Evaluación de conformidad previa al despliegue

### Prohibiciones absolutas

El reglamento prohíbe sin excepciones ciertos usos: sistemas de puntuación social por parte de gobiernos, manipulación subliminal o la identificación biométrica en tiempo real en espacios públicos (con excepciones muy limitadas).

### Qué deben hacer las empresas ahora

El plazo de aplicación es escalonado, pero las empresas deben comenzar ya a:

1. **Inventariar** los sistemas de IA que utilizan o desarrollan
2. Clasificar cada sistema según las categorías del reglamento
3. Designar un responsable de cumplimiento en IA
4. Revisar contratos con proveedores de tecnología

La preparación temprana será una ventaja competitiva. Contacte con nuestro equipo para una evaluación de conformidad.`,
    seo_titulo: 'Reglamento Europeo de IA: obligaciones para empresas | Martínez & Asociados',
    seo_descripcion: 'Análisis del AI Act europeo y sus implicaciones prácticas para empresas que desarrollan o utilizan sistemas de inteligencia artificial.',
  },
  {
    titulo: 'Novedades en materia de precios de transferencia tras la reforma fiscal',
    slug: 'novedades-precios-transferencia-reforma-fiscal',
    publicado: 1,
    fecha_publicacion: '2024-02-20',
    categorias: JSON.stringify(['Fiscal', 'Internacional']),
    extracto: 'La reciente reforma del Impuesto sobre Sociedades introduce cambios relevantes en el régimen de operaciones vinculadas y precios de transferencia. Examinamos las principales novedades.',
    contenido: `## Precios de transferencia: el nuevo marco normativo

La reforma del Impuesto sobre Sociedades aprobada el pasado ejercicio incorpora las directrices OCDE 2022 en materia de precios de transferencia, con implicaciones directas para los grupos multinacionales con presencia en España.

### Las tres novedades más relevantes

#### 1. Documentación simplificada para grupos medianos

Se introduce un umbral de facturación (inferior a 45 millones de euros) por debajo del cual los grupos pueden optar por una documentación simplificada, reduciendo la carga administrativa.

#### 2. Nuevos criterios para intangibles

Las modificaciones en la valoración de activos intangibles difíciles de valorar (HTVI, por sus siglas en inglés) obligan a revisar estructuras que involucren cesión de marcas, patentes o know-how entre entidades del grupo.

#### 3. Acuerdos previos de valoración (APAs)

La reforma simplifica el procedimiento para obtener APAs, tanto unilaterales como bilaterales o multilaterales, reduciendo los plazos de resolución.

### Recomendaciones prácticas

- Revisar la política de precios de transferencia del grupo antes del cierre del ejercicio
- Actualizar la documentación (masterfile y local file) conforme a los nuevos requisitos
- Valorar la solicitud de un APA en operaciones significativas con alto riesgo de controversia

Nuestro equipo fiscal puede acompañarle en esta revisión y en la negociación con la Administración Tributaria.`,
    seo_titulo: 'Precios de transferencia: novedades tras la reforma fiscal | Martínez & Asociados',
    seo_descripcion: 'Análisis de los cambios en el régimen de precios de transferencia y operaciones vinculadas introducidos por la última reforma del Impuesto sobre Sociedades.',
  },
  {
    titulo: 'El arbitraje como alternativa eficiente a la litigación en contratos internacionales',
    slug: 'arbitraje-alternativa-litigacion-contratos-internacionales',
    publicado: 1,
    fecha_publicacion: '2024-01-10',
    categorias: JSON.stringify(['Litigación', 'Internacional']),
    extracto: 'Cuándo conviene incluir una cláusula de arbitraje en un contrato internacional, qué instituciones elegir y cómo redactar la cláusula para evitar problemas futuros.',
    contenido: `## Arbitraje internacional: ventajas, riesgos y buenas prácticas

El arbitraje se ha consolidado como el mecanismo preferido para la resolución de disputas en contratos internacionales. Sin embargo, su eficacia depende en gran medida de cómo se haya redactado la cláusula arbitral y de la elección de la institución adecuada.

### Por qué elegir el arbitraje

Las ventajas del arbitraje frente a la litigación ordinaria son conocidas: **confidencialidad**, neutralidad del foro, posibilidad de elegir árbitros especializados y, especialmente, la **ejecutabilidad del laudo** en más de 170 países gracias a la Convención de Nueva York.

Para contratos entre partes de distintos países, la alternativa de acudir a los tribunales ordinarios implica incertidumbre sobre el foro competente, posibles litigios paralelos y dificultades en la ejecución de sentencias.

### Elegir la institución correcta

La elección de la institución arbitral es determinante. Las más utilizadas a nivel global son:

- **ICC** (Cámara de Comercio Internacional): la más prestigiosa para contratos de gran envergadura
- **LCIA** (London Court of International Arbitration): muy utilizada en contratos anglosajones
- **CIAR** (Corte Internacional de Arbitraje de Madrid): excelente opción para contratos con partes iberoamericanas
- **SCC** (Stockholm Chamber of Commerce): referencia en contratos con países nórdicos y del Este

### La cláusula arbitral: errores frecuentes

Una cláusula arbitral mal redactada puede generar más conflictos que los que pretende evitar. Los errores más habituales son:

1. No especificar la **sede del arbitraje** (determina la ley procesal aplicable)
2. Olvidar indicar el **número de árbitros** (uno o tres)
3. No prever el **idioma del procedimiento**
4. Incluir cláusulas escalonadas (mediación previa) sin definir los plazos con precisión

### Recomendación

Antes de firmar un contrato internacional de relevancia, consulte con un especialista en arbitraje para asegurarse de que la cláusula de resolución de disputas está correctamente redactada y es ejecutable en las jurisdicciones relevantes.`,
    seo_titulo: 'Arbitraje internacional en contratos: guía práctica | Martínez & Asociados',
    seo_descripcion: 'Guía práctica sobre el arbitraje como alternativa a la litigación en contratos internacionales: elección de institución, redacción de cláusulas y ejecución de laudos.',
  },
  {
    titulo: 'Claves del nuevo régimen de EREs y ERTEs tras la reforma laboral',
    slug: 'claves-eres-ertes-reforma-laboral',
    publicado: 1,
    fecha_publicacion: '2023-12-05',
    categorias: JSON.stringify(['Laboral']),
    extracto: 'La reforma laboral modifica sustancialmente los procedimientos de despido colectivo y suspensión temporal de empleo. Revisamos los aspectos más relevantes para las empresas.',
    contenido: `## EREs y ERTEs: el nuevo marco tras la reforma laboral

La reforma laboral ha introducido cambios significativos en los procedimientos de regulación de empleo, tanto en los expedientes de regulación de empleo (ERE) como en los expedientes de regulación temporal de empleo (ERTE).

### Cambios en el ERE: nuevas obligaciones de negociación

El período de consultas sigue siendo el eje del procedimiento, pero la reforma exige una negociación más genuina y documentada. Los puntos clave:

- **Mayor peso del plan de recolocación externa** para EREs de más de 50 trabajadores
- Obligación de acreditar con más detalle la **causa económica, técnica, organizativa o productiva**
- Refuerzo de la comisión de trabajadores en empresas sin representación legal

### ERTEs por causas ETOP: simplificación procedimental

Para los ERTEs basados en causas económicas, técnicas, organizativas o productivas (ETOP), la reforma simplifica el procedimiento en empresas con menos de 50 trabajadores, reduciendo el período de consultas a 7 días.

### ERTEs por fuerza mayor: el mecanismo RED

La reforma crea el **Mecanismo RED** (Resiliencia, Estabilización y Transición), un instrumento de activación gubernamental para situaciones de crisis sectorial o cíclica que sustituye parcialmente al antiguo ERTE por fuerza mayor.

### Recomendaciones para empresas

- Revisar los convenios colectivos aplicables antes de iniciar cualquier procedimiento
- Documentar con rigor las causas que justifican la medida
- Iniciar el diálogo con la representación de los trabajadores antes del inicio formal del período de consultas`,
    seo_titulo: 'EREs y ERTEs tras la reforma laboral: novedades clave | Martínez & Asociados',
    seo_descripcion: 'Análisis de los cambios en los expedientes de regulación de empleo introducidos por la reforma laboral: nuevas obligaciones, plazos y el Mecanismo RED.',
  },
  {
    titulo: 'Due diligence en M&A: aspectos críticos que no puede ignorar',
    slug: 'due-diligence-ma-aspectos-criticos',
    publicado: 1,
    fecha_publicacion: '2023-11-18',
    categorias: JSON.stringify(['Corporativo', 'M&A']),
    extracto: 'Una due diligence bien ejecutada es la diferencia entre una buena operación y un problema futuro. Repasamos los focos de riesgo más habituales y cómo gestionarlos.',
    contenido: `## Due diligence en fusiones y adquisiciones: guía para compradores

La due diligence legal es el proceso de análisis y verificación de los activos, pasivos, contratos y riesgos de una empresa objetivo antes de cerrar una operación de compraventa. Una due diligence bien ejecutada protege al comprador y permite negociar un precio y unas garantías adecuados.

### Los cinco focos de riesgo más habituales

#### 1. Contingencias laborales ocultas

Los pasivos laborales son frecuentemente infravalorados. Es esencial revisar el historial de litigios, el cumplimiento de convenios colectivos, la política de retribución variable y los contratos de alta dirección con blindajes significativos.

#### 2. Propiedad intelectual no consolidada

En empresas tecnológicas, es crítico verificar que la compañía sea efectivamente titular del software, las marcas y las patentes que utiliza. Los desarrollos realizados por freelancers sin cesión expresa de derechos son una fuente recurrente de conflictos postransacción.

#### 3. Contratos con cláusulas de cambio de control

Muchos contratos de distribución, licencia o financiación incluyen cláusulas que permiten a la contraparte resolver o renegociar en caso de cambio de control. Su identificación temprana permite planificar la transacción para minimizar el impacto.

#### 4. Cumplimiento normativo (compliance)

La revisión del cumplimiento en materia de competencia, protección de datos (RGPD), prevención del blanqueo de capitales y anticorrupción es imprescindible, especialmente en operaciones transfronterizas.

#### 5. Deuda y pasivos fuera de balance

Las contingencias fiscales, los avales y garantías otorgados, los compromisos de capex futuro y los pasivos medioambientales pueden representar un coste significativo no reflejado en el balance.

### El informe de due diligence como herramienta de negociación

El informe no es solo un documento de análisis: es la base para negociar las **declaraciones y garantías** del contrato de compraventa (SPA), los **mecanismos de ajuste de precio** y los **seguros de representaciones y garantías** (W&I insurance).`,
    seo_titulo: 'Due diligence en M&A: guía de riesgos para compradores | Martínez & Asociados',
    seo_descripcion: 'Guía práctica sobre los focos de riesgo más habituales en una due diligence legal en operaciones de fusiones y adquisiciones y cómo gestionarlos.',
  },
];

for (const a of articulos) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO articulos
          (titulo, slug, publicado, fecha_publicacion, categorias, extracto, contenido, seo_titulo, seo_descripcion)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [a.titulo, a.slug, a.publicado, a.fecha_publicacion, a.categorias,
           a.extracto, a.contenido, a.seo_titulo, a.seo_descripcion],
  });
}

// ─────────────────────────────────────────────
// NOTICIAS
// ─────────────────────────────────────────────
console.log('📰  Noticias...');
const noticias = [
  {
    titulo: 'Martínez & Asociados asesora en la mayor operación de M&A del sector energético del año',
    slug: 'asesora-operacion-ma-sector-energetico',
    publicado: 1,
    fecha_publicacion: '2024-03-20',
    extracto: 'Nuestro despacho ha asesorado a un consorcio europeo en la adquisición de una cartera de parques eólicos en España y Portugal por un importe de 1.200 millones de euros.',
    contenido: `Martínez & Asociados ha actuado como asesor legal exclusivo del comprador en la adquisición de una cartera de 15 parques eólicos en operación ubicados en España y Portugal, con una potencia instalada total de 480 MW.

La operación, valorada en 1.200 millones de euros, fue cerrada en un plazo récord de cuatro meses y ha sido reconocida como la mayor transacción del sector renovable en la Península Ibérica durante el primer trimestre del año.

El equipo fue liderado por el socio fundador Nicolás Martínez Vidal, con el apoyo del área fiscal dirigida por Elena Casado, que estructuró los aspectos tributarios de la operación en ambas jurisdicciones.`,
  },
  {
    titulo: 'El despacho reconocido por Chambers Europe 2024 en cuatro categorías',
    slug: 'reconocido-chambers-europe-2024',
    publicado: 1,
    fecha_publicacion: '2024-02-28',
    extracto: 'Chambers and Partners ha reconocido a Martínez & Asociados en su edición 2024, con cuatro socios incluidos en Band 1 de sus respectivas especialidades.',
    contenido: `Martínez & Asociados ha sido reconocido en la edición 2024 de Chambers Europe, la guía de referencia del sector legal, en las siguientes categorías:

- **Corporate/M&A**: Band 1
- **Tax**: Band 1  
- **Dispute Resolution**: Band 2
- **Employment**: Band 2

Cuatro de los socios del despacho han sido reconocidos individualmente, lo que consolida al despacho como una de las firmas de referencia en España para operaciones corporativas complejas.

"Este reconocimiento es el resultado del trabajo excepcional de todo el equipo y de la confianza que nuestros clientes depositan en nosotros", declaró Nicolás Martínez.`,
  },
  {
    titulo: 'Nueva incorporación: Carlos Mendoza se une al equipo corporativo como asociado senior',
    slug: 'incorporacion-carlos-mendoza-asociado-senior',
    publicado: 1,
    fecha_publicacion: '2024-01-15',
    extracto: 'El despacho refuerza su área de M&A y private equity con la incorporación de Carlos Mendoza, procedente de la banca de inversión en Londres.',
    contenido: `Martínez & Asociados anuncia la incorporación de Carlos Mendoza Ríos como asociado senior en el área corporativa, con foco en transacciones de private equity y financiación de startups tecnológicas.

Carlos Mendoza cuenta con más de ocho años de experiencia en operaciones de M&A, habiendo trabajado anteriormente en el departamento de banca de inversión de una entidad financiera de primer nivel en Londres.

"La incorporación de Carlos refuerza nuestra capacidad para acompañar a fondos de inversión y empresas tecnológicas en sus operaciones más complejas", indicó el socio Nicolás Martínez.`,
  },
  {
    titulo: 'Javier Ortega nombrado árbitro en un procedimiento ICC de 300 millones de euros',
    slug: 'javier-ortega-arbitro-icc',
    publicado: 1,
    fecha_publicacion: '2023-12-10',
    extracto: 'El socio Javier Ortega ha sido designado árbitro presidente en un procedimiento ante la Corte Internacional de Arbitraje de la ICC por una disputa contractual en el sector de infraestructuras.',
    contenido: `El socio Javier Ortega Puente ha sido designado árbitro presidente en un procedimiento ante la Corte Internacional de Arbitraje de la Cámara de Comercio Internacional (ICC) por una disputa contractual valorada en aproximadamente 300 millones de euros en el sector de infraestructuras.

Este nombramiento confirma la reputación internacional de Javier Ortega como uno de los principales especialistas en arbitraje del país. Es el tercer nombramiento como árbitro en procedimientos ICC en los últimos dos años.

"Es un honor ser designado en un procedimiento de esta relevancia. El arbitraje internacional es una herramienta esencial para la seguridad jurídica en los grandes proyectos de infraestructuras", señaló Ortega.`,
  },
];

for (const n of noticias) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO noticias
          (titulo, slug, publicado, fecha_publicacion, extracto, contenido)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [n.titulo, n.slug, n.publicado, n.fecha_publicacion, n.extracto, n.contenido],
  });
}

// ─────────────────────────────────────────────
// ACTUALIZAR servicios y sectores destacados en config
// ─────────────────────────────────────────────
console.log('🔗  Vinculando destacados en configuración...');

const { rows: srvRows } = await db.execute('SELECT id FROM servicios WHERE destacado = 1 ORDER BY orden LIMIT 3');
const { rows: secRows } = await db.execute('SELECT id FROM sectores ORDER BY orden LIMIT 3');
const { rows: mbrRows } = await db.execute('SELECT id FROM miembros WHERE mostrar_en_home = 1 ORDER BY orden LIMIT 3');

await db.execute({
  sql: `UPDATE configuracion SET
    servicios_destacados = ?,
    sectores_destacados = ?,
    equipo_destacado = ?
    WHERE id = 1`,
  args: [
    JSON.stringify(srvRows.map(r => r.id)),
    JSON.stringify(secRows.map(r => r.id)),
    JSON.stringify(mbrRows.map(r => r.id)),
  ],
});

console.log('\n✅  Seed completado:');
console.log(`   - 1 configuración actualizada`);
console.log(`   - ${servicios.length} servicios`);
console.log(`   - ${sectores.length} sectores`);
console.log(`   - ${miembros.length} miembros del equipo`);
console.log(`   - ${articulos.length} artículos de conocimiento`);
console.log(`   - ${noticias.length} noticias`);

process.exit(0);
