/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        chip: 'rgb(var(--chip) / <alpha-value>)',
        'tint-1': 'rgb(var(--tint-1) / <alpha-value>)',
        'tint-2': 'rgb(var(--tint-2) / <alpha-value>)',
        'tint-3': 'rgb(var(--tint-3) / <alpha-value>)',
        'tint-4': 'rgb(var(--tint-4) / <alpha-value>)',
      },
      borderRadius: { card: '20px' },
      fontFamily: { sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
