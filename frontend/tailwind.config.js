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
          100: "#cce6e6",
          200: "#99cccc",
          300: "#66b3b3",
          400: "#339999",
          500: "#008080",
          600: "#006666",
          700: "#004d4d",
          800: "#003333",
          900: "#001a1a",
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
