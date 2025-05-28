/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",  // For Expo Router (if using)
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#F59E0B',
        'primary-dark': '#B45309',
        'primary-light': '#FCE5BD',

        accent: '#10B981',
        'accent-dark': '#085D41',

        secondary: '#3B82F6',
        'secondary-dark': '#1D4ED8',


        dark: '#1F2937',
        muted: '#6B7280',
        neutral: '#F5F5F4',
        alert: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'ui-sans-serif'],
        'inter': ['Inter_400Regular', 'ui-sans-serif'],
        'inter-medium': ['Inter_500Medium', 'ui-sans-serif'],
        'inter-bold': ['Inter_700Bold', 'ui-sans-serif'],
        'inter-semibold': ['Inter_600SemiBold', 'ui-sans-serif'],
        'nunito': ['NunitoSans_400Regular', 'ui-sans-serif'],
        'nunito-bold': ['NunitoSans_700Bold', 'ui-sans-serif'],
        'nunito-extrabold': ['NunitoSans_800ExtraBold', 'ui-sans-serif'],
      },
    },
  },
  plugins: [],
}

