const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, globalShortcut, ipcMain, clipboard } = require('electron');
const { URL, RESOURCES_PATH } = require('./modules/constants')

if (require('electron-squirrel-startup')) return app.quit();

let window = null;

if(!fs.existsSync(RESOURCES_PATH)){
    fs.mkdirSync(RESOURCES_PATH);
}

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
            contextIsolation: false,
            webSecurity: false
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

ipcMain.handle('drop', (event, paths) => {
    return new Promise((resolve, reject) => {
        let current = [];

        let cf = index => {
            let file = paths[index];
            let ex = path.basename(file).split('.');
            let cc = fs.readdirSync(RESOURCES_PATH).length;
            let pt = `i${cc}.${ex[ex.length - 1]}`;
            let fp = path.join(RESOURCES_PATH, pt);

            current.push(fp);

            fs.copyFile(file, fp, error => {
                if(error) reject(error);

                if(paths.length === index + 1) {
                    resolve(current);
                } else {
                    cf(index + 1);
                }
            });
        }

        if(paths.length > 0) {
            cf(0);
        }
    });
});

ipcMain.on('get-files', event => {
    event.reply('get-files-reply', fs.readdirSync(RESOURCES_PATH).map(file => path.join(RESOURCES_PATH, file)).reverse());
});

ipcMain.on('copy', (event, path) => {
    if(path) {
        clipboard.writeImage(path);

        if(!!window) {
            window.close();
        }
    }
});

ipcMain.on('remove', (event, path) => {
    if(path) {
        try {
            fs.unlinkSync(path);
        } catch(e) {
            console.error(e);
        }
    }
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