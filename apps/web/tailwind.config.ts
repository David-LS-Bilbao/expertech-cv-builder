import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Colors · extracted from DESIGN.md / Stitch mockups ──────────────
      colors: {
        // Surfaces
        'surface':                   '#faf8ff',
        'surface-dim':               '#d2d9f4',
        'surface-bright':            '#faf8ff',
        'surface-container-lowest':  '#ffffff',
        'surface-container-low':     '#f2f3ff',
        'surface-container':         '#eaedff',
        'surface-container-high':    '#e2e7ff',
        'surface-container-highest': '#dae2fd',
        'surface-variant':           '#dae2fd',
        'surface-tint':              '#006591',
        // On-surfaces
        'on-surface':         '#131b2e',
        'on-surface-variant': '#3e4850',
        'inverse-surface':    '#283044',
        'inverse-on-surface': '#eef0ff',
        // Primary · Electric Blue
        'primary':               '#006591',
        'on-primary':            '#ffffff',
        'primary-container':     '#0ea5e9',
        'on-primary-container':  '#003751',
        'inverse-primary':       '#89ceff',
        'primary-fixed':         '#c9e6ff',
        'primary-fixed-dim':     '#89ceff',
        'on-primary-fixed':      '#001e2f',
        'on-primary-fixed-variant': '#004c6e',
        // Secondary · Tech Green
        'secondary':               '#006c49',
        'on-secondary':            '#ffffff',
        'secondary-container':     '#6cf8bb',
        'on-secondary-container':  '#00714d',
        'secondary-fixed':         '#6ffbbe',
        'secondary-fixed-dim':     '#4edea3',
        'on-secondary-fixed':      '#002113',
        'on-secondary-fixed-variant': '#005236',
        // Tertiary · Soft Coral (critical CTAs)
        'tertiary':               '#bc0b3b',
        'on-tertiary':            '#ffffff',
        'tertiary-container':     '#ff697b',
        'on-tertiary-container':  '#6c001d',
        'tertiary-fixed':         '#ffdadb',
        'tertiary-fixed-dim':     '#ffb2b7',
        'on-tertiary-fixed':      '#40000d',
        'on-tertiary-fixed-variant': '#92002a',
        // Error
        'error':             '#ba1a1a',
        'on-error':          '#ffffff',
        'error-container':   '#ffdad6',
        'on-error-container':'#93000a',
        // Outline / borders
        'outline':         '#6e7881',
        'outline-variant': '#bec8d2',
        // Background
        'background':    '#faf8ff',
        'on-background': '#131b2e',
      },

      // ── Typography · Inter scale from DESIGN.md ──────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg':     ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':     ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md':    ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm':    ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.5rem',
        sm:      '0.25rem',
        md:      '0.75rem',
        lg:      '1rem',
        xl:      '1.5rem',
        full:    '9999px',
      },

      // ── Box shadows · Elevation levels from DESIGN.md ────────────────────
      boxShadow: {
        'card':  '0px 4px 12px rgba(15, 23, 42, 0.05)',
        'auth':  '0px 12px 24px rgba(15, 23, 42, 0.10)',
        'modal': '0px 12px 24px rgba(15, 23, 42, 0.10)',
        'primary-glow': '0px 4px 12px rgba(0, 101, 145, 0.20)',
      },

      // ── Spacing extras from DESIGN.md ─────────────────────────────────────
      spacing: {
        'base':            '8px',
        'gutter-desktop':  '24px',
        'margin-desktop':  '48px',
        'gutter-mobile':   '16px',
        'margin-mobile':   '20px',
        'section-gap':     '80px',
      },
    },
  },
  plugins: [],
}

export default config
