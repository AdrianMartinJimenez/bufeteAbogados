import { defineMiddleware } from 'astro:middleware';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

const PUBLIC_ADMIN = new Set(['/admin/login']);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith('/admin') || PUBLIC_ADMIN.has(pathname)) {
    return next();
  }

  const token = getTokenFromRequest(context.request);
  if (!token) return context.redirect('/admin/login');

  const payload = await verifyToken(token);
  if (!payload) return context.redirect('/admin/login');

  context.locals.user = payload;
  return next();
});
