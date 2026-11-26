/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#dbeafe',
          text: '#1e3a5f',
        },
        secondary: {
          DEFAULT: '#64748b',
          hover: '#475569',
          light: '#f1f5f9',
        },
        success: {
          DEFAULT: '#059669',
          light: '#d1fae5',
          text: '#064e3b',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#fef3c7',
          text: '#78350f',
        },
        error: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          light: '#fee2e2',
          text: '#7f1d1d',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        'gradient-bg': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
        'gradient-primary-hover-dark': 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
        'gradient-bg-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.5) 100%)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-strong': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-strong': '0 16px 48px 0 rgba(15, 23, 42, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-strong-dark': '0 16px 48px 0 rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '2xl': '24px',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-up': 'slideUp 300ms ease-out',
        'fade-in': 'fadeIn 300ms ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(30px, -30px) rotate(90deg)' },
          '50%': { transform: 'translate(-20px, 20px) rotate(180deg)' },
          '75%': { transform: 'translate(-30px, -20px) rotate(270deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}