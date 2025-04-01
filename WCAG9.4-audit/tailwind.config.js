/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h1: {
              fontSize: '2em',
              marginTop: '0',
              marginBottom: '0.8333333em',
              lineHeight: '1.4',
              fontWeight: '800',
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h2: {
              color: theme('colors.blue.900'),
              fontWeight: '700',
              fontFamily: theme('fontFamily.display').join(', '),
              marginTop: '3rem',
              marginBottom: '1.5rem',
            },
            h3: {
              color: theme('colors.purple.700'),
              fontWeight: '600',
              fontFamily: theme('fontFamily.display').join(', '),
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
            },
            h4: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontFamily: theme('fontFamily.display').join(', '),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: theme('colors.gray.800'),
              backgroundColor: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.md'),
              padding: '0.2em 0.4em',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.lg'),
              padding: theme('spacing.6'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                color: 'inherit',
              },
            },
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.blue.700'),
                textDecoration: 'underline',
              },
            },
            'ul > li': {
              position: 'relative',
              paddingLeft: '1.5em',
              '&::before': {
                content: '""',
                width: '0.5em',
                height: '0.125em',
                position: 'absolute',
                left: 0,
                top: '0.8em',
                backgroundColor: theme('colors.gray.300'),
              },
            },
            'ol > li': {
              paddingLeft: '0.5em',
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.blue.500'),
              backgroundColor: theme('colors.blue.50'),
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '2rem',
              marginBottom: '2rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.blue.300'),
            },
            h3: {
              color: theme('colors.purple.300'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.800'),
            },
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            blockquote: {
              borderLeftColor: theme('colors.blue.500'),
              backgroundColor: theme('colors.blue.900'),
              color: theme('colors.gray.300'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};