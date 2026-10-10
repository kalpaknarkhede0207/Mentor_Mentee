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
         * ROYAL BLUE & ELECTRIC ORANGE (THE HIGH-IMPACT COMPLEMENTARY)
         * 
         * The Psychology:
         * Blue triggers feelings of trust, stability, and intelligence.
         * Orange is the ultimate color of enthusiasm, creativity, and uninhibited energy.
         * 
         * Why it works:
         * Sitting directly opposite on the color wheel creates an immediate visual vibration.
         * The calm authority of blue prevents the orange from looking cheap, resulting in
         * a vibrant, highly professional, and deeply impressive look.
         */
        slate: {
          50: '#f7faff',   // Crisp Royal Tint - High-Impact Bright Canvas
          100: '#f0f5fc',  // Soft Royal Blue Tint - Card & Pill Background
          200: '#e0ebf8',  // Crisp Royal Border & Outlines
          300: '#c4d5ed',  // Subtle Royal Divider
          400: '#8da6cc',  // Muted Royal Blue-Gray - Metadata & Icons
          500: '#5072a7',  // Dignified Royal Secondary Text
          600: '#255bb5',  // Vivid Royal Blue - Interactive Highlights
          700: '#1c4585',  // Deep Royal Blue
          800: '#143261',  // Solid Collegiate Royal Blue - Drawers, Headers, Cards
          900: '#0d2347',  // Deep Authority Royal Blue - Foundation & Text
          950: '#07152b',  // Midnight Royal Blue - Anchor
        },
        royal: {
          50: '#f7faff',
          100: '#f0f5fc',
          200: '#e0ebf8',
          300: '#c4d5ed',
          400: '#8da6cc',
          500: '#255bb5',
          600: '#1c4585',
          700: '#143261',
          800: '#0d2347',
          900: '#07152b',
          950: '#040b17',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#ff8533',  // Electric Orange Tint
          500: '#ff6200',  // Pure Electric Orange - High Visual Vibration
          600: '#ea5200',  // Punchy Electric Orange
          700: '#c23c00',
          800: '#9a3000',
          900: '#7c2600',
        },
        amber: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#ff8533',  // Electric Orange Accent
          500: '#ff6200',  // Pure Electric Orange
          600: '#ea5200',  // Punchy Electric Orange
          700: '#c23c00',
          800: '#9a3000',
          900: '#7c2600',
        },
        marigold: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#ff8533',
          500: '#ff6200',
          600: '#ea5200',
          700: '#c23c00',
          800: '#9a3000',
          900: '#7c2600',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0d2347", // Royal Blue
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f0f5fc",
          foreground: "#0d2347",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f0f5fc",
          foreground: "#5072a7",
        },
        accent: {
          DEFAULT: "#ff6200", // Electric Orange
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0d2347",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0d2347",
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
