/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map both old names (obsidian, pearl, gold) and new names (charcoal, ivory, mutedGold)
        // to our curated premium classic luxury palette.
        charcoal: {
          950: '#121215', // Deep luxurious warm black
          900: '#1a1a1f', // Rich dark gray
          800: '#25252b', // Medium gray
          700: '#34343d', // Accent gray
          600: '#484854'
        },
        obsidian: {
          950: '#121215',
          900: '#1a1a1f',
          800: '#25252b',
          700: '#34343d',
          600: '#484854'
        },
        ivory: {
          50: '#fcfbf7',  // Crisp premium white-ivory
          100: '#f8f5ee', // Standard light ivory
          200: '#ebd9be', // Soft warm beige
          300: '#e5decb',
          400: '#d7cdb7',
          500: '#c5b89e'
        },
        pearl: {
          50: '#fcfbf7',
          100: '#f8f5ee',
          200: '#ebd9be',
          300: '#e5decb',
          400: '#d7cdb7',
          500: '#c5b89e'
        },
        mutedGold: {
          100: '#fdf5f7',
          200: '#f5cfda',
          300: '#e299ae',
          400: '#ca5b7b',
          500: '#6b092b', // Burgundy
          600: '#540420',
          700: '#3d0216',
          800: '#28010e'
        },
        gold: {
          50: '#fdf5f7',
          100: '#faf0f2',
          200: '#f5cfda',
          300: '#e299ae',
          400: '#ca5b7b',
          500: '#6b092b', // Burgundy
          600: '#540420',
          700: '#3d0216',
          800: '#28010e',
          950: '#1c020b'
        },
        emerald: {
          950: '#071813',
          900: '#0d281f',
          800: '#193f33',
          700: '#275747',
          600: '#3c7965'
        },
        sage: {
          50: '#f4f6f3',
          100: '#e6eae2',
          200: '#cbd4c4',
          300: '#abb9a2',
          400: '#89997f',
          500: '#6d7c64'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif']
      },
      backgroundImage: {
        'mutedGold-gradient': 'linear-gradient(135deg, #b83b5e 0%, #6b092b 50%, #3d0216 100%)',
        'gold-gradient': 'linear-gradient(135deg, #b83b5e 0%, #6b092b 50%, #3d0216 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(107, 9, 43, 0.25) 0%, rgba(18, 18, 21, 0) 70%)',
        'sage-gradient': 'linear-gradient(135deg, #cbd4c4 0%, #89997f 60%, #6d7c64 100%)',
        'warm-gradient': 'linear-gradient(135deg, rgba(37, 37, 43, 0.75) 0%, rgba(18, 18, 21, 0.9) 100%)'
      },
      boxShadow: {
        'gold-sm': '0 2px 12px rgba(184, 150, 92, 0.1)',
        'gold-lg': '0 8px 32px rgba(184, 150, 92, 0.15)',
        'gold-glow': '0 0 40px rgba(184, 150, 92, 0.2)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 16s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        }
      }
    }
  },
  plugins: []
}
