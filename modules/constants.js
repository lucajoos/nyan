const { app } = require('electron');

const path = require('path');

const r = {
    URL: app.isPackaged ? `file://${path.join(__dirname, '/../build/index.html')}` : 'http://localhost:3000'
};

module.exports = r;