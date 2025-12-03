import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FFB400",
                secondary: "#0F172A",
                accent: "#06B6D4",
                neutral: {
                    light: "#F8FAFC",
                    dark: "#0B1220",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
            },
            container: {
                center: true,
                padding: "1rem",
            },
        },
    },
    plugins: [],
};
export default config;
