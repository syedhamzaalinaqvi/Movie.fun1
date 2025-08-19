/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414',
          gray: '#757575',
        },
      },
      backgroundImage: {
        'gradient-to-b': 'linear-gradient(to bottom,rgba(20,20,20,0) 0,rgba(20,20,20,.15) 15%,rgba(20,20,20,.35) 29%,#141414 100%)',
      },
    },
  },
  plugins: [],
}
