module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        "full-remove-nav": "calc(100vh - 100px)",
      },
    },
  },
  plugins: [],
};
