
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
        // Dark Mode Colors (Default)
        border: {
          DEFAULT: "#1F2937",
          light: "#CBD5E0",
        },
        input: {
          DEFAULT: "#191933",
          light: "#EDF2F7",
        },
        ring: {
          DEFAULT: "#60B5B5",
          light: "#60B5B5",
        },
        background: {
          DEFAULT: "#0C0C1C",
          light: "#F7FAFC",
        },
        foreground: {
          DEFAULT: "#E6E6F0",
          light: "#1A202C",
        },
        secondary: {
          DEFAULT: "#993887",
          foreground: "#E6E6F0",
          light: "#993887",
          "light-foreground": "#1A202C",
        },
        primary: {
          DEFAULT: "#60B5B5",
          foreground: "#0C0C1C",
          light: "#60B5B5",
          "light-foreground": "#1A202C",
        },
        accent: {
          DEFAULT: "#E6E6F0",
          foreground: "#0C0C1C",
          light: "#3182CE",
          "light-foreground": "#F7FAFC",
        },
        card: {
          DEFAULT: "#191933",
          foreground: "#E6E6F0",
          light: "#EDF2F7",
          "light-foreground": "#1A202C",
        },
        muted: {
          DEFAULT: "#121826",
          foreground: "#A3A3B3",
          light: "#EDF2F7",
          "light-foreground": "#4A5568",
        },
        success: {
          DEFAULT: "#5EF2B1",
          light: "#38B2AC",
        },
        error: {
          DEFAULT: "#F87171",
          light: "#E53E3E",
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
