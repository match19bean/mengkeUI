/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(primary|secondary|alert|complementary|brown)-(1|2|3|4|5|6|7|8|9|10)/,
    },
    {
      pattern: /text-(h1|h2|h3|h4|h5|title|subtitle|body|caption|small|button-s|button-m|button-l)/,
    },
    'bg-cream',
    'text-cream',
    'border-cream',
  ],
  theme: {
    extend: {
      boxShadow: {
        'popup': '0 18px 48px rgba(0,0,0,0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        primary: {
          1: '#EE7959',
          2: '#FF9B80',
          3: '#FDBDAC',
        },
        secondary: {
          1: '#347462',
          2: '#21A07D',
          3: '#40DDB0',
        },
        alert: {
          1: '#FF3700',
        },
        complementary: {
          1: '#FFC649',
          2: '#597AEE',
        },
        brown: {
          1: '#362010',
          2: '#4C3829',
          3: '#615042',
          4: '#77685B',
          5: '#8C8074',
          6: '#A2978C',
          7: '#B7AFA5',
          8: '#CDC7BE',
          9: '#E2DFD7',
          10: '#F8F7F0',
        },
        cream: '#F8F7F0',
        subtitle: '#8A8A8A',
      },
      fontFamily: {
        primary: ['Noto Sans TC', 'sans-serif'],
        secondary: ['Gen Jyuu Gothic XP', 'serif'],
        genyogothic: ['GenYoGothic TW', 'sans-serif'],
      },
      fontSize: {
        'h1': '40px',
        'h2': '32px',
        'h3': '24px',
        'h4': '20px',
        'h5': '18px',
        'title': '16px',
        'subtitle': '14px',
        'body': '16px',
        'caption': '12px',
        'small': '10px',
        'button-s': '13px',
        'button-m': '14px',
        'button-l': '16px',
        'calendar-s': '12px',
        'calendar-m': '14px',
        'calendar-l': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
