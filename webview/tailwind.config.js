/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // blue-800
          hover: '#1E3A8A', // blue-900
          light: '#3B82F6', // blue-500
        },
        secondary: {
          DEFAULT: '#4F46E5', // indigo-600
          hover: '#4338CA', // indigo-700
          light: '#6366F1', // indigo-500
        },
        background: {
          DEFAULT: '#0e0f0e', // dark background
          light: '#1a1b1a', // slightly lighter
          dark: '#050505', // darker shade
        },
        text: {
          DEFAULT: '#FFFFFF', // white
          muted: '#9CA3AF', // gray-400
          light: '#F3F4F6', // gray-100
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)', // white with opacity
          light: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(255, 255, 255, 0.15)',
        }
      },
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
      },
    },
    screens: {
      'sidebar': { 'max': '700px' },
      'mini': { 'max': '450px' },
    },
  },
  plugins: [],
}
