const { app } = require('electron');

const path = require('path');

const r = {
    URL: app.isPackaged ? `file://${path.join(__dirname, '../build/index.html')}` : 'http://localhost:3000',
    RESOURCES_PATH: path.join(__dirname, `${app.isPackaged ? '../' : ''}../resources/`)
};

module.exports = r;