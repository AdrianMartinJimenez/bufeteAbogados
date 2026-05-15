import { z } from 'zod';

export const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().optional(),
  email: z.string().email('Introduce un email válido'),
  telefono: z.string().optional(),
  asunto: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  mensaje: z
    .string()
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(2000, 'El mensaje no puede superar los 2000 caracteres'),
  privacidad: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la política de privacidad' }),
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
