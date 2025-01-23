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
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#00CC44',
                light: '#33FF77',
                dark: '#009933',
                hover: '#00B33C',
                100: '#E6FFF0',
                200: '#B3FFD1',
                300: '#80FFB3',
                400: '#4DFF95',
                500: '#00CC44',
                600: '#00B33C',
                700: '#009933',
                800: '#00802B',
                900: '#006622',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: '#003366',
                light: '#0066CC',
                dark: '#002244',
                hover: '#004080',
                100: '#E6F0FF',
                200: '#B3D1FF',
                300: '#80B3FF',
                400: '#4D94FF',
                500: '#003366',
                600: '#002D5C',
                700: '#002244',
                800: '#001A33',
                900: '#001122',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
            success: {
                DEFAULT: '#10B981',
                light: '#34D399',
                dark: '#059669'
            },
            warning: {
                DEFAULT: '#F59E0B',
                light: '#FBBF24',
                dark: '#D97706'
            },
            error: {
                DEFAULT: '#EF4444',
                light: '#F87171',
                dark: '#DC2626'
            },
            info: {
                DEFAULT: '#3B82F6',
                light: '#60A5FA',
                dark: '#2563EB'
            },
        stroke: '#E6EBF1',
        'stroke-dark': '#27303E',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
