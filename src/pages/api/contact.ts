import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/schemas';

export const prerender = false;

// Rate limiting simple en memoria (resetea al reiniciar el servidor)
const rateLimit = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000; // 1 minuto

function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  // Content-Type check
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ message: 'Content-Type no válido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Rate limiting
  const ip = getClientIP(request);
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ message: 'Demasiadas solicitudes. Inténtelo más tarde.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parsear y validar cuerpo
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: 'JSON no válido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({ message: 'Datos no válidos', errors: result.error.flatten().fieldErrors }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { nombre, empresa, email, telefono, asunto, mensaje } = result.data;

  // Enviar email
  const resendKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_EMAIL;

  if (!resendKey || !toEmail) {
    console.error('Faltan variables de entorno: RESEND_API_KEY o CONTACT_EMAIL');
    return new Response(
      JSON.stringify({ message: 'Error de configuración del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: 'web@despacho.com',
      to: toEmail,
      replyTo: email,
      subject: `[Web] ${asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #0A0A0A;">${asunto}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Nombre:</td><td style="padding: 8px 0; font-size: 13px;">${nombre}</td></tr>
            ${empresa ? `<tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Empresa:</td><td style="padding: 8px 0; font-size: 13px;">${empresa}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Email:</td><td style="padding: 8px 0; font-size: 13px;"><a href="mailto:${email}">${email}</a></td></tr>
            ${telefono ? `<tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Teléfono:</td><td style="padding: 8px 0; font-size: 13px;">${telefono}</td></tr>` : ''}
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #F8F7F4; border-left: 3px solid #C9A84C;">
            <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${mensaje}</p>
          </div>
          <hr style="margin: 24px 0; border-color: #E2E0DB;" />
          <p style="color: #6B6B6B; font-size: 11px;">Formulario web · ${new Date().toLocaleString('es-ES')}</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ message: 'Mensaje enviado correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
    return new Response(
      JSON.stringify({ message: 'Error al enviar el mensaje. Por favor, inténtelo más tarde.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
