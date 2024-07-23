/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': {'max': '599px' },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': { 'min': '600px', 'max': '899px' },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': { 'min': '900px' },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }
    },
    colors: {
      // Colors
      "background-color": "#000000",
      'white': '#ffffff',
      'black': '#000000',
      'black-gray': '#262626',
      'black-light': '#1a1a1a',
      'navy': '#000080',
      'red': '#ff0000',
      'red-hover': '#cc0000',
      'blue': '#00bfff',
      "blue-hover": "#0099ff",
      'blue_border': '#006dff',
      'blue_border-hover': '#0052cc',
      'gray': '#8492a6', 
      'gray-light': '#cccccc',
      'gray-dark': '#404040',
      'white-input-light': '#f2f2f2',
      "card": "#cce6ff"
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      pointerEvents: ['responsive', 'hover', 'focus'],
      animation: {
        'meteor': 'meteor 5s ease-in-out infinite',
      },
      keyframes: {
        meteor: {
          '0%': { transform: 'translate(0, 0)', opacity: 1 },
          '70%': { transform: 'translate(calc(100vw), calc(100vh))', opacity: 1 },
          '100%': { transform: 'translate(calc(100vw), calc(100vh))', opacity: 0 },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      zIndex: {
        "-1": "-1",
      },
      transformOrigin: {
        "0": "0%",
      },
    }
  },
  plugins: [],
}