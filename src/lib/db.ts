import { createClient } from '@libsql/client';

if (!import.meta.env.TURSO_DATABASE_URL) {
  throw new Error('Falta la variable de entorno TURSO_DATABASE_URL');
}

export const db = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});
