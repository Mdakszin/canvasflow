import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class",
  content: [ /* ... */ ],
  theme: {
    extend: {
      colors: {
        text: 'var(--color-text)',
        background: 'var(--color-background)',
        primary: 'var(--color-primary)',   // Headings
        secondary: 'var(--color-secondary)', // Links & Icons
        accent: 'var(--color-accent)',
      }
    },
  },
  plugins: [],
}
export default config