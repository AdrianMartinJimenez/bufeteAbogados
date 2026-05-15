/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        firm: {
          black: '#0A0A0A',
          white: '#F8F7F4',
          gold: '#C9A84C',
          muted: '#6B6B6B',
          border: '#E2E0DB',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.firm.black'),
            fontFamily: theme('fontFamily.sans').join(', '),
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontWeight: '400',
            },
            a: {
              color: theme('colors.firm.gold'),
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            },
            blockquote: {
              borderLeftColor: theme('colors.firm.gold'),
              fontFamily: theme('fontFamily.serif').join(', '),
              fontStyle: 'italic',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
