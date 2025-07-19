/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['"Pretendard Variable"', 'sans-serif'],
        lora: ['Lora', 'serif'],
        opensans: ['"Open Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};
