/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: { userId: number; email: string };
  }
}

interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly JWT_SECRET: string;
  readonly RESEND_API_KEY: string;
  readonly CONTACT_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
