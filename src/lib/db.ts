import { createClient } from '@libsql/client';

const dbUrl = process.env.TURSO_DATABASE_URL ?? import.meta.env.TURSO_DATABASE_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN ?? import.meta.env.TURSO_AUTH_TOKEN;

if (!dbUrl) {
  throw new Error('Falta la variable de entorno TURSO_DATABASE_URL');
}

export const db = createClient({
  url: dbUrl,
  authToken: dbToken,
});
