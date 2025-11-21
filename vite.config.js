// tailwind.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  tailwind: {
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 0.3s ease-out',
          'slide-in': 'slideIn 0.3s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideIn: {
            '0%': { transform: 'scaleX(0)' },
            '100%': { transform: 'scaleX(1)' },
          },
        },
         fadeIn: {
      "0%": { opacity: 0, transform: "scale(0.95)" },
      "100%": { opacity: 1, transform: "scale(1)" },
    },
  },
  animation: {
    fadeIn: "fadeIn 0.6s ease-in-out",
      },
    },
  },
})
