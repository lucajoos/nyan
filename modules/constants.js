const { app } = require('electron');

const path = require('path');
const fs = require('fs');

const r = {
    URL: app.isPackaged ? `file://${path.join(__dirname, '../build/index.html')}` : 'http://localhost:3000',
    RESOURCES_PATH: path.join(__dirname, `${app.isPackaged ? '../' : ''}../resources/`),
    PREVIEWS_PATH: path.join(__dirname, `${app.isPackaged ? '../' : ''}../previews/`)
};

if(!fs.existsSync(r.RESOURCES_PATH)) {
    fs.mkdirSync(r.RESOURCES_PATH);
}

if(!fs.existsSync(r.PREVIEWS_PATH)) {
    fs.mkdirSync(r.PREVIEWS_PATH);
}


module.exports = r;