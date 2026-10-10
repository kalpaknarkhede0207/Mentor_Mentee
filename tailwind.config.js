/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /**
         * THE PRESTIGIOUS ACADEMIC COLOR PSYCHOLOGY
         * Secondary Schools, Universities, High-End Academies
         * 
         * 1. Navy Blue (Oxford / Collegiate):
         *    Instils authority for faculty and institutional pride for parents & leadership.
         *    Mapped across dark slate values (slate-950, 900, 800, 700).
         * 
         * 2. Warm Gray (Parchment / Archival Linen):
         *    Instils parental dignity and an elevated, scholarly stationery feel.
         *    Mapped across light slate values (slate-50, 100, 200, 300).
         * 
         * 3. Marigold Yellow (Academic Gold):
         *    Focused energy for students, academic honors, achievement points, and active focal points.
         */
        slate: {
          50: '#fbf9f5',   // Warm Gray - Ivory / Academic Parchment
          100: '#f2efe9',  // Warm Gray - Soft card / pill background
          200: '#e5e1d8',  // Warm Gray - Refined border & outlines
          300: '#d3cebf',  // Warm Gray - Subtle divider
          400: '#8c95a6',  // Scholarly Blue-Gray - Metadata & timestamps
          500: '#5c697f',  // Dignified Slate-Navy - Body secondary text
          600: '#3a4b68',  // Mid Navy - Secondary interactive
          700: '#23395d',  // Deep Academic Navy
          800: '#142542',  // Collegiate Navy - Headers, modal bars, drawers
          900: '#0b172a',  // Oxford Navy Blue - High institutional authority
          950: '#060d18',  // Midnight Navy - Deepest anchor
        },
        navy: {
          50: '#f0f4f9',
          100: '#dde6f2',
          200: '#bed0e6',
          300: '#92b2d4',
          400: '#5f8ebd',
          500: '#3d6ea6',
          600: '#2b548a',
          700: '#23395d',
          800: '#142542',
          900: '#0b172a',
          950: '#060d18',
        },
        warmGray: {
          50: '#fbf9f5',
          100: '#f2efe9',
          200: '#e5e1d8',
          300: '#d3cebf',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        marigold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#fbbf24',
          500: '#f59e0b',  // Radiant Marigold Yellow
          600: '#d97706',  // Academic Gold
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        amber: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#fbbf24',  // Radiant Marigold Yellow
          500: '#f59e0b',  // Radiant Marigold Yellow
          600: '#d97706',  // Academic Gold
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0b172a",
          foreground: "#fbf9f5",
        },
        secondary: {
          DEFAULT: "#f2efe9",
          foreground: "#0b172a",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f2efe9",
          foreground: "#5c697f",
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#0b172a",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0b172a",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0b172a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
