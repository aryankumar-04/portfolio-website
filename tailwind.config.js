/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      tablet: '810px',
      desktop: '1280px',
    },
    extend: {
      colors: {
        page: 'var(--color-page-bg)',
        card: 'var(--color-card-bg)',
        modal: 'var(--color-modal-bg)',
        media: 'var(--color-media-bg)',
        'pdf-area': 'var(--color-pdf-area-bg)',
        'surface-2': 'var(--color-surface-2)',
        'footer-bg': 'var(--color-footer-bg)',
        heading: 'var(--color-text-heading)',
        body: 'var(--color-text-body)',
        muted: 'var(--color-text-muted)',
        dim: 'var(--color-text-dim)',
        'tech-name': 'var(--color-tech-name)',
        'border-theme': 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        'input-border': 'var(--color-input-border)',
        'input-border-focus': 'var(--color-input-border-focus)',
        cream: {
          DEFAULT: '#FAF7F3',
          90: 'rgba(250, 247, 243, 0.9)',
          50: 'rgba(250, 247, 243, 0.5)',
          30: 'rgba(250, 247, 243, 0.3)',
          10: 'rgba(250, 247, 243, 0.1)',
        },
        dark: {
          DEFAULT: '#111111',
          50: 'rgba(17, 17, 17, 0.5)',
          10: 'rgba(0, 0, 0, 0.1)',
        },
        'accent-red': '#EB4D6D',
      },
      fontFamily: {
        sans: ['Archivo', '"Archivo Placeholder"', 'sans-serif'],
      },
      maxWidth: {
        framer: '1180px',
      },
      borderRadius: {
        '16': '16px',
        '20': '20px',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
};
