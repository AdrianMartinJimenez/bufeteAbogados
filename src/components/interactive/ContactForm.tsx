'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { contactSchema, type ContactFormData } from '@/lib/schemas';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'Error al enviar el formulario');
      }
      setStatus('success');
      reset();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Error desconocido');
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full border-b ${hasError ? 'border-red-500' : 'border-firm-border'} bg-transparent pt-5 pb-2 text-sm font-sans focus:outline-none focus:border-firm-black transition-colors placeholder:text-transparent peer`;

  const labelClass = 'absolute top-4 left-0 text-sm font-sans text-firm-muted pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-firm-gold peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs';

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <p className="font-serif text-3xl font-light text-firm-black mb-3">Mensaje recibido</p>
        <p className="text-firm-muted font-sans text-sm">Nos pondremos en contacto con usted en breve.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-xs font-sans uppercase tracking-[0.15em] text-firm-gold hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Nombre + Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <input
            {...register('nombre')}
            id="nombre"
            placeholder="Nombre"
            className={inputClass(!!errors.nombre)}
            autoComplete="name"
          />
          <label htmlFor="nombre" className={labelClass}>Nombre *</label>
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>
        <div className="relative">
          <input
            {...register('empresa')}
            id="empresa"
            placeholder="Empresa"
            className={inputClass(false)}
            autoComplete="organization"
          />
          <label htmlFor="empresa" className={labelClass}>Empresa (opcional)</label>
        </div>
      </div>

      {/* Email + Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="Email"
            className={inputClass(!!errors.email)}
            autoComplete="email"
          />
          <label htmlFor="email" className={labelClass}>Email *</label>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="relative">
          <input
            {...register('telefono')}
            id="telefono"
            type="tel"
            placeholder="Teléfono"
            className={inputClass(false)}
            autoComplete="tel"
          />
          <label htmlFor="telefono" className={labelClass}>Teléfono (opcional)</label>
        </div>
      </div>

      {/* Asunto */}
      <div className="relative">
        <input
          {...register('asunto')}
          id="asunto"
          placeholder="Asunto"
          className={inputClass(!!errors.asunto)}
        />
        <label htmlFor="asunto" className={labelClass}>Asunto *</label>
        {errors.asunto && <p className="text-red-500 text-xs mt-1">{errors.asunto.message}</p>}
      </div>

      {/* Mensaje */}
      <div className="relative">
        <textarea
          {...register('mensaje')}
          id="mensaje"
          rows={5}
          placeholder="Mensaje"
          className={`${inputClass(!!errors.mensaje)} resize-none`}
        />
        <label htmlFor="mensaje" className={labelClass}>Mensaje *</label>
        {errors.mensaje && <p className="text-red-500 text-xs mt-1">{errors.mensaje.message}</p>}
      </div>

      {/* Privacidad */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register('privacidad')}
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-firm-black flex-shrink-0"
          />
          <span className="text-xs font-sans text-firm-muted leading-relaxed">
            He leído y acepto la{' '}
            <a href="/politica-privacidad" className="text-firm-gold hover:underline" target="_blank">
              Política de Privacidad
            </a>{' '}
            y consiento el tratamiento de mis datos. *
          </span>
        </label>
        {errors.privacidad && <p className="text-red-500 text-xs mt-1">{errors.privacidad.message}</p>}
      </div>

      {/* Error global */}
      {status === 'error' && (
        <p className="text-red-500 text-sm font-sans">{errorMsg || 'Ha ocurrido un error. Por favor, inténtelo de nuevo.'}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 border border-firm-black px-8 py-3.5 text-xs font-sans uppercase tracking-[0.2em] hover:bg-firm-black hover:text-firm-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Enviando…' : 'Enviar consulta'}
      </button>
    </form>
  );
}
