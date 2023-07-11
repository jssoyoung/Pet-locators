/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,handlebars}',
    './views/*.{html,js,handlebars}',
    './views/layouts/*.{html,js,handlebars}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        pcfc: ['Pacifico'],
      },
    },
  },
  plugins: [],
};

// RUN this before you work on styling: npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
