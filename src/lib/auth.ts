import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export const COOKIE_NAME = 'admin_token';
const MAX_AGE = 60 * 60 * 8; // 8 horas

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? import.meta.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: number, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${MAX_AGE}s`)
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ userId: number; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { userId: number; email: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match?.[1] ?? null;
}

export function authCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function clearCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`;
}
