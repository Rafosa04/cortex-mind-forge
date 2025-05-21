
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
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "card-pop": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "floating-dots": {
          "0%, 100%": { 
            backgroundPosition: "0% 0%",
            opacity: "0.3"
          },
          "50%": { 
            backgroundPosition: "100% 100%",
            opacity: "0.5" 
          }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(96, 181, 181, 0.5)' 
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(96, 181, 181, 0.8), 0 0 20px rgba(153, 56, 135, 0.4)' 
          }
        }
      },
      animation: {
        "card-pop": "card-pop 0.5s cubic-bezier(0.22,1,0.36,1)",
        "floating-dots": "floating-dots 15s ease infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s infinite ease-in-out'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '20px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(96, 181, 181, 0.5)',
            borderRadius: '20px',
          },
        },
        '.animate-floating-dots': {
          position: 'absolute',
          inset: '0',
          background: 'radial-gradient(circle, rgba(96, 181, 181, 0.05) 1px, transparent 5px), radial-gradient(circle, rgba(153, 56, 135, 0.05) 1px, transparent 5px)',
          backgroundSize: '40px 40px, 30px 30px',
          animation: 'floating-dots 15s ease infinite',
          zIndex: '0',
        },
        '.glass-morphism': {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(25, 25, 51, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
        },
        '.neon-anim': {
          transition: 'all 0.3s ease',
          '&:hover': {
            textShadow: '0 0 5px rgba(96, 181, 181, 0.7), 0 0 10px rgba(96, 181, 181, 0.5)',
          },
        },
        '.text-gradient': {
          backgroundImage: 'linear-gradient(to right, #60B5B5, #993887)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        },
        '.btn-glow': {
          '&:hover': {
            boxShadow: '0 0 15px rgba(96, 181, 181, 0.6)',
          }
        }
      };
      addUtilities(newUtilities);
    }
  ],
} satisfies Config;
