/** @type {import('tailwindcss').Config} */
module.exports = {
  // Cover all source files that use NativeWind classes
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
    './stores/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Kinship Protocol Color Palette ───────────────────────────────
      colors: {
        // Surfaces
        surface: {
          DEFAULT: '#fbf9f9',
          dim: '#dbdad9',
          bright: '#fbf9f9',
          lowest: '#ffffff',
          low: '#f5f3f3',
          DEFAULT: '#efeded',
          high: '#e9e8e7',
          highest: '#e3e2e2',
          // Dark mode surfaces
          dark: '#0f0f0f',
          'dark-dim': '#1a1a1a',
          'dark-low': '#141414',
          'dark-container': '#1e1e1e',
          'dark-high': '#242424',
          'dark-highest': '#2a2a2a',
        },
        // Content
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#4c4546',
        'inverse-surface': '#303031',
        'inverse-on-surface': '#f2f0f0',
        // Structural
        outline: '#7e7576',
        'outline-variant': '#cfc4c5',
        // Primary (black system)
        primary: {
          DEFAULT: '#000000',
          container: '#1b1b1b',
          'on-container': '#848484',
          fixed: '#e2e2e2',
          'fixed-dim': '#c6c6c6',
          'on-fixed': '#1b1b1b',
          'on-fixed-variant': '#474747',
          inverse: '#c6c6c6',
        },
        'on-primary': '#ffffff',
        // Secondary
        secondary: {
          DEFAULT: '#5d5f5f',
          container: '#dfe0e0',
          'on-container': '#616363',
          fixed: '#e2e2e2',
          'fixed-dim': '#c6c6c7',
          'on-fixed': '#1a1c1c',
          'on-fixed-variant': '#454747',
        },
        'on-secondary': '#ffffff',
        // Tertiary / Accent — Engineering Red
        tertiary: {
          DEFAULT: '#000000',
          container: '#410004',
          'on-container': '#ef4544',
        },
        'on-tertiary': '#ffffff',
        // Error
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        'on-error': '#ffffff',
        // Semantic accent shorthand
        accent: '#ef4544',        // Engineering Red — ≤5% of UI
        'accent-dark': '#e53e3e', // Slightly brighter for dark mode
        // Background
        background: '#fbf9f9',
        'on-background': '#1b1c1c',
        // Dark mode overrides (referenced via dark: variant)
        'dark-bg': '#0a0a0a',
        'dark-surface': '#141414',
        'dark-border': '#262626',
        'dark-text': '#f0f0f0',
        'dark-muted': '#737373',
      },

      // ─── Typography ───────────────────────────────────────────────────
      fontFamily: {
        // Primary — Google Sans Flex (all body, headings, UI text)
        sans: ['GoogleSansFlex', 'Google Sans', 'system-ui', 'sans-serif'],
        // Monospace — JetBrains Mono (metadata only: years, IDs, stats, timestamps)
        mono: ['JetBrainsMono', 'JetBrains Mono', 'monospace'],
      },

      fontSize: {
        // Display
        display: ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        // Headlines
        'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg-mobile': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '500' }],
        // Body
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        // Labels
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        // Mono label (caps) — JetBrains Mono, graduation year / ID / timestamp
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
      },

      // ─── Spacing (8pt grid) ───────────────────────────────────────────
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        canvas: '24px', // margin-canvas
        gutter: '16px',
      },

      // ─── Border Radius (Soft-Square) ──────────────────────────────────
      borderRadius: {
        sm: '0.125rem', // 2px — chips, checkboxes
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem',   // 8px — buttons, inputs, cards
        xl: '0.75rem',  // 12px — modals, sheets
        full: '9999px',
      },
    },
  },
  plugins: [],
};
