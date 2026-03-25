/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-ai': 'var(--brand-ai)',
        'app-bg': 'var(--bg-app)',
        'surface-card': 'var(--surface-card)',
        'text-primary': 'var(--text-primary)',
        // Compatibility Aliases
        navy: '#0F172A',
        blue: '#4F46E5',
        purple: '#7C3AED',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'ai-panel': '0 8px 30px rgb(0, 0, 0, 0.04)',
        'active': '0 1px 2px 0 rgb(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

