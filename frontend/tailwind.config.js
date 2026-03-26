/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        ocean: "#0ea5e9",
        lime: "#84cc16",
        ember: "#f97316"
      }
    }
  },
  plugins: []
};
