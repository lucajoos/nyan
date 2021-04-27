module.exports = {
    webpack: {
        configure: {
            target: 'electron-renderer'
        }
    },

    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
}