import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dir, '../.env'), 'utf-8');
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
}

const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const r = await db.execute("SELECT id, email, activo, substr(password_hash,1,10) as hash_preview FROM usuarios");
console.log('Usuarios en BD:');
console.table(r.rows);
process.exit(0);
