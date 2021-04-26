module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        selection: 'var(--color-selection)',
        highlight: 'var(--color-highlight)'
      },

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
