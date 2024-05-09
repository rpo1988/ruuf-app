import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5a6ed5",
        "primary-lighter": "#5a6ed5b3",
        "primary-darker": "#3a4db4",
      },
    },
  },
  plugins: [],
};
export default config;
