import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080F1C",
        surface: "#0c1321",
        "surface-dim": "#0c1321",
        "surface-bright": "#323948",
        "surface-container-lowest": "#070e1b",
        "surface-container-low": "#101c2b",
        "surface-container": "#142235",
        "surface-container-high": "#232a38",
        "surface-container-highest": "#2e3543",
        "surface-variant": "#2e3543",
        "surface-tint": "#2be0af",
        "surface-border": "#1f334e",
        
        "on-surface": "#F5FAFF",
        "on-surface-variant": "#A5B7C8",
        "on-background": "#F5FAFF",

        primary: "#85ffd4",
        "on-primary": "#003829",
        "primary-container": "#37e6b5",
        "on-primary-container": "#00634b",
        "primary-fixed": "#57fdca",
        "primary-fixed-dim": "#2be0af",

        secondary: "#53C7F5",
        "on-secondary": "#003546",
        "secondary-container": "#019cc9",
        "on-secondary-container": "#002e3d",
        "secondary-fixed": "#bee9ff",
        "secondary-fixed-dim": "#69d3ff",

        tertiary: "#dfe9ff",
        "on-tertiary": "#1d314c",
        "tertiary-container": "#bacef0",
        "on-tertiary-container": "#445875",

        outline: "#85948c",
        "outline-variant": "#1f334e",

        warning: "#F6C453",
        danger: "#F16B77",
        success: "#43D9A3",
        
        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "gutter": "1rem",
        "gutter-lg": "1.5rem",
        "margin-md": "1.5rem",
        "margin-lg": "2rem",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(55, 230, 181, 0.25)",
        "glow-primary-lg": "0 0 35px rgba(55, 230, 181, 0.4)",
        "glow-secondary": "0 0 20px rgba(83, 199, 245, 0.25)",
        "surface-card": "0 8px 32px 0 rgba(4, 8, 16, 0.45)",
        "surface-elevated": "0 16px 48px -8px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(55, 230, 181, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;

