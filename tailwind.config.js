/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        stone: '#B6B09F',
        linen: '#EAE4D5',
        chalk: '#F2F2F2',
        white: '#FFFFFF',
        lime: '#C8F135',
        danger: '#C0392B',
        success: '#2E7D32',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        none: '0',
      },
      maxWidth: {
        page: '1120px',
        content: '720px',
      },
    },
  },
  corePlugins: {
    // Brand: square corners throughout, no shadows.
    borderRadius: false,
    boxShadow: false,
  },
  plugins: [],
}
