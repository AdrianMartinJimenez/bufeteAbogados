/**
 * Script de configuración inicial de la base de datos.
 * Ejecutar: npm run setup
 * 
 * ⚠️  Crea las tablas y un usuario admin inicial.
 * Cambia la contraseña en el primer acceso.
 */

import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// Leer .env manualmente
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
} catch {
  // .env no encontrado, usar variables de entorno del sistema
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌  Falta TURSO_DATABASE_URL en .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

// Ejecutar migración
const sql = readFileSync(join(__dir, 'migrate.sql'), 'utf-8');
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log('🗄️  Creando tablas...');
for (const stmt of statements) {
  await db.execute(stmt);
}
console.log('✅  Tablas creadas');

// Crear usuario admin inicial
const email = process.env.ADMIN_EMAIL || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin';
const hash = await bcrypt.hash(password, 12);

await db.execute({
  sql: 'INSERT OR REPLACE INTO usuarios (email, password_hash, nombre) VALUES (?, ?, ?)',
  args: [email, hash, 'Administrador'],
});

console.log('\n🔐  Usuario admin creado:');
console.log(`   Email:      ${email}`);
console.log(`   Contraseña: ${password}`);
console.log('\n⚠️   CAMBIA LA CONTRASEÑA desde /admin después del primer acceso.\n');
console.log('✨  Setup completado. Ejecuta: npm run dev');

process.exit(0);
