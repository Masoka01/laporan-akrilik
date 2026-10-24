/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        body: ['Barlow', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#0b7e88',
          dark: '#4ccbd3',
          ink: '#ffffff',
          'ink-dark': '#05181a',
        },
      },
    },
  },
  plugins: [],
}
