export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '128': '32rem',  // Custom height, 32rem (512px)
        '144': '36rem',  // Custom height, 36rem (576px)
        '160': '40rem',  // Custom height, 40rem (640px)
      },
      textShadow: {
        outline: '2px 2px 4px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}