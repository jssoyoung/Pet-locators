/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,handlebars}',
    './views/*.{html,js,handlebars}',
  ],
  theme: {
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
