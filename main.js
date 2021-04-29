const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, globalShortcut, ipcMain, clipboard } = require('electron');
const { URL, RESOURCES_PATH } = require('./modules/constants')
const Store = require('electron-store');

if(require('electron-squirrel-startup')) return app.quit();

const store = new Store();

if(!store.get('length')) {
    store.set('length', 0);
}

let window = null;
let focused = true;

let init = () => {
    window = new BrowserWindow({
        width: 1300,
        height: 820,
        frame: false,
        show: false,
        transparent: true,
        icon: './src/assets/icons/win/icon.ico',
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

    window.on('blur', () => {
        focused = false;
    });

    window.on('focus', () => {
        focused = true;
    });
};

ipcMain.on('paste', event => {
    const text = clipboard.readText();
    const image = clipboard.readImage()?.toPNG();

    fs.readdir(RESOURCES_PATH, (error, dir) => {
        const cc = dir.length;
        const tp = path.join(RESOURCES_PATH, `${ cc }.txt`);
        const ip = path.join(RESOURCES_PATH, `${ cc + 1 }.png`);

        if(text) {
            fs.writeFile(tp, text, { encoding: 'utf-8' }, () => {
                event.sender.send('new', {
                    path: tp,
                    editing: true
                });
            });
        } else if(image) {
            fs.writeFile(ip, image, () => {
                event.sender.send('new', {
                    path: ip,
                    editing: false
                });
            });
        }
    })
});

ipcMain.on('close', () => {
    if(!!window) {
        window.close();
    }
});

app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+M', () => {
        if(!window) {
            init();
        } else if(focused) {
            window.close();
        } else {
            window.focus();
        }
    });

    init();
});

app.on('activate', () => {
    if(window === null) {
        init();
    }
});

app.on('window-all-closed', e => {
    e.preventDefault();
});

require('./modules/cards')(window);