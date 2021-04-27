module.exports = {
  darkMode: false,
  theme: {
    fontFamily: {
      sans: [ 'OpenSans' ],
    },

    colors: {
      background: {
        default: 'var(--color-background-default)',
        hover: 'var(--color-background-hover)',
        accent: 'var(--color-background-accent)'
      },

      primary: {
        default: 'var(--color-primary-default)',
        accent: 'var(--color-primary-accent)'
      },

      text: {
        default: 'var(--color-text-default)',
      }
    },

    extend: {
      gridTemplateColumns: {
        list: 'repeat(auto-fill, minmax(250px, 1fr))'
      },

      gridAutoRows: {
        '200px': '200px',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
