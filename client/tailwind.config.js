import flowbite from "flowbite-react/tailwind"
import tailwindScrollbar from "tailwind-scrollbar"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,cjs,mjs}","./src/**/*.{html,js}", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin(), tailwindScrollbar],
}
