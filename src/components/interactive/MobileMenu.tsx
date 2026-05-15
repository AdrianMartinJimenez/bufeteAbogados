'use client';
import { useState, useEffect } from 'react';

interface NavItem {
  titulo: string;
  slug: string;
}

interface Props {
  servicios: NavItem[];
  sectores: NavItem[];
}

export default function MobileMenu({ servicios, sectores }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = () => setIsOpen((v) => !v);
  const toggleSection = (section: string) =>
    setOpenSection((v) => (v === section ? null : section));

  // Conectar con el botón hamburger del Header
  useEffect(() => {
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;
    const handleClick = () => setIsOpen(true);
    btn.addEventListener('click', handleClick);
    return () => btn.removeEventListener('click', handleClick);
  }, []);

  // Sincronizar aria-expanded del botón header
  useEffect(() => {
    const btn = document.getElementById('mobile-menu-btn');
    if (btn) btn.setAttribute('aria-expanded', String(isOpen));
  }, [isOpen]);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Botón hamburger controlado por el Header, pero necesitamos el estado aquí */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menú de navegación"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          backgroundColor: '#0A0A0A',
          color: '#F8F7F4',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease',
          overflowY: 'auto',
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={toggle}
          aria-label="Cerrar menú"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Nav content */}
        <nav style={{ padding: '5rem 2rem 2rem' }}>
          {/* Servicios accordion */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => toggleSection('servicios')}
              aria-expanded={openSection === 'servicios'}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 0',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 300,
                textAlign: 'left',
              }}
            >
              Servicios
              <span style={{ fontSize: '1.25rem', color: '#C9A84C' }}>
                {openSection === 'servicios' ? '−' : '+'}
              </span>
            </button>
            {openSection === 'servicios' && (
              <div style={{ paddingBottom: '1rem' }}>
                {servicios.map((s) => (
                  <a
                    key={s.slug}
                    href={`/servicios/${s.slug}`}
                    style={{
                      display: 'block',
                      padding: '0.6rem 0',
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {s.titulo}
                  </a>
                ))}
                <a
                  href="/servicios"
                  style={{ display: 'block', paddingTop: '0.75rem', color: '#C9A84C', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  onClick={() => setIsOpen(false)}
                >
                  Ver todos →
                </a>
              </div>
            )}
          </div>

          {/* Sectores accordion */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => toggleSection('sectores')}
              aria-expanded={openSection === 'sectores'}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 0',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 300,
                textAlign: 'left',
              }}
            >
              Sectores
              <span style={{ fontSize: '1.25rem', color: '#C9A84C' }}>
                {openSection === 'sectores' ? '−' : '+'}
              </span>
            </button>
            {openSection === 'sectores' && (
              <div style={{ paddingBottom: '1rem' }}>
                {sectores.map((s) => (
                  <a
                    key={s.slug}
                    href={`/sectores/${s.slug}`}
                    style={{
                      display: 'block',
                      padding: '0.6rem 0',
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {s.titulo}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links directos */}
          {[
            { label: 'Equipo', href: '/equipo' },
            { label: 'Conocimiento', href: '/conocimiento' },
            { label: 'Prensa', href: '/prensa' },
          ].map((item) => (
            <div key={item.href} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <a
                href={item.href}
                style={{
                  display: 'block',
                  padding: '1.25rem 0',
                  color: 'inherit',
                  textDecoration: 'none',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem',
                  fontWeight: 300,
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </div>
          ))}

          <a
            href="/contacto"
            style={{
              display: 'inline-block',
              marginTop: '2rem',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '0.75rem 2rem',
              color: 'inherit',
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </a>
        </nav>
      </div>

      {/* Listener para el botón del Header */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('mobile-menu-btn')?.addEventListener('click', function() {
              const menu = document.getElementById('mobile-menu');
              const isOpen = menu?.style.transform === 'translateX(0)';
              if (menu) menu.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0)';
              this.setAttribute('aria-expanded', String(!isOpen));
            });
          `,
        }}
      />
    </>
  );
}
