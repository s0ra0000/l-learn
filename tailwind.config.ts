import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4751CD",
        primary_hover: "#6069D2",
        secondary: "#1E2738",
        tertiary: "#181F2E",
        success: "#8AD866",
        progress: "#E5B265",
        not_yet: "#FF9999",
        background: "#EBEDF0",
      },
    },
  },
  plugins: [],
};
export default config;
