/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'geometric-light': "repeating-linear-gradient(45deg, rgba(0,100,0,0.03) 0px, rgba(0,100,0,0.03) 2px, transparent 2px, transparent 8px)",
        'geometric-dark': "repeating-linear-gradient(45deg, rgba(255,215,0,0.05) 0px, rgba(255,215,0,0.05) 2px, transparent 2px, transparent 8px)",
      },
      // এখানে নতুন কী-ফ্রেম যোগ করা হয়েছে
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 50px rgba(239, 68, 68, 0.8)' },
        },
        darkGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 60px rgba(59, 130, 246, 0.8)' },
        }
      },
      // এখানে অ্যানিমেশন ক্লাস ডিফাইন করা হয়েছে
      animation: {
        'glow-pulse': 'glow 3s ease-in-out infinite',
        'dark-glow-pulse': 'darkGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}