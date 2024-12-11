/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        primary: {
          100: "#ccf4f9",
          200: "#99eaf3",
          300: "#66dfec",
          400: "#33d5e6",
          500: "#00cae0",
          600: "#00a2b3",
          700: "#007986",
          800: "#00515a",
          900: "#00282d",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "gradient-1":
          "linear-gradient(to bottom, #00AAFF 8%, #00AAFF 5%, #00AAFF 0%)",
        // Second Gradient
        "gradient-2": "linear-gradient(to bottom, #00ADF8 0%, #0081F9 8%)",
        // Third Gradient
        "gradient-3": "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
