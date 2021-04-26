const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { URL } = require('./modules/constants')

let window = null;

let init = () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.loadURL(URL)
        .then(() => {
            window.show();
        })
        .catch(e => {
            throw e;
        })

    window.on('closed', () => {
        window = null;
    });
};

ipcMain.handle('drop-file', (event, file) => {
    return new Promise((resolve, reject) => {
        let bp = path.join(__dirname, '/resources/');
        let ex = path.basename(file).split('.');
        let cc = fs.readdirSync(bp).length;
        let pt = `i${cc}.${ex[ex.length - 1]}`;

        fs.copyFile(file, path.join(bp, pt) , error => {
            if(error) reject(error);

            resolve(pt);
        });
    });
});

ipcMain.on('get-files', event => {
    let bp = path.join(__dirname, '/resources/');

    event.reply({
        path: bp,
        count: fs.readdirSync(bp).length
    });
});

app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+M', () => {
        if(!window) {
            init();
        }
    });

    init();
});

app.on('activate', () => {
    if (window === null) {
        init();
    }
});

app.on('window-all-closed', e => {
    e.preventDefault();
});