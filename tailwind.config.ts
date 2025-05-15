import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: "#191933",
        input: "#191933",
        ring: "#60B5B5",
        background: "#0C0C1C",
        foreground: "#E6E6F0",
        primary: {
          DEFAULT: "#60B5B5",
          foreground: "#0C0C1C"
        },
        secondary: {
          DEFAULT: "#993887",
          foreground: "#E6E6F0"
        },
        accent: {
          DEFAULT: "#E6E6F0",
          foreground: "#0C0C1C"
        },
        card: {
          DEFAULT: "#191933",
          foreground: "#E6E6F0"
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem'
      },
      keyframes: {
        "card-pop": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
      },
      animation: {
        "card-pop": "card-pop 0.5s cubic-bezier(0.22,1,0.36,1)",
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
