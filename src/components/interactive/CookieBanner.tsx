'use client';
import { useState, useEffect } from 'react';

const COOKIE_KEY = 'cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'all');
    setVisible(false);
  };

  const essential = () => {
    localStorage.setItem(COOKIE_KEY, 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        backgroundColor: '#0A0A0A',
        color: '#F8F7F4',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '1.25rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.8125rem', fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, flex: '1 1 400px' }}>
          Utilizamos cookies propias y de terceros para analizar el uso de nuestra web y mejorar su experiencia.
          Puede gestionar sus preferencias o consultar nuestra{' '}
          <a href="/politica-cookies" style={{ color: '#C9A84C', textDecoration: 'underline' }}>
            Política de Cookies
          </a>
          .
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={essential}
            style={{
              padding: '0.5rem 1.25rem',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Solo esenciales
          </button>
          <button
            onClick={accept}
            style={{
              padding: '0.5rem 1.25rem',
              border: '1px solid #C9A84C',
              background: '#C9A84C',
              color: '#0A0A0A',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500,
            }}
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
