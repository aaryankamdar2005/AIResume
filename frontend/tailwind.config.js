/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: 'var(--primary-navy)',
        blue: 'var(--accent-blue)',
        'lumina-slate': 'var(--bg-slate)',
        'lumina-dark': 'var(--bg-white)',
        charcoal: 'var(--text-charcoal)',
        silver: 'var(--border-silver)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
      },
    },
  },
  plugins: [],
}
