module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
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
