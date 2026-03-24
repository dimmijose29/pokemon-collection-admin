import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './formkit.theme.ts'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: ['daisyui'],
  daisyui: {
    themes: [
      {
        pokemon: {
          // ... tutti i tuoi colori OKLCH ...

          // Font
          '--font-sans': '"Manrope", system-ui, sans-serif',
          '--font-heading': '"Lexend", sans-serif',

          // Applica font di default al body
          '--font-family': 'var(--font-sans)',

          // Applica font-heading a titoli
          '--font-heading-family': 'var(--font-heading)',
        },
      },
    ],
  },
}

export default config
