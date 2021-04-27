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

ipcMain.on('paste', event => {
    const text = clipboard.readText();
    const image = clipboard.readImage()?.toPNG();

    fs.readdir(RESOURCES_PATH, (error, dir) => {
        const cc = dir.length;
        const tp = path.join(RESOURCES_PATH, `${cc}.txt`);
        const ip = path.join(RESOURCES_PATH, `${cc + 1}.png`);

        if(text) {
            fs.writeFile(tp, text, () => {

            });
        }

        if(image) {
            fs.writeFile(ip, image, () => {

            });
        }
    })
})

ipcMain.on('drop', (event, paths) => {
    let cf = index => {
        const file = paths[index];
        const ex = path.basename(file).split('.');

        fs.readdir(RESOURCES_PATH, (error, dir) => {
            const cc = dir.length;

            const pt = `${cc}.${ex[ex.length - 1]}`;
            const fp = path.join(RESOURCES_PATH, pt);

            fs.copyFile(file, fp, error => {
                if(error) throw error;

                event.sender.send('new', fp);

                if(index < paths.length - 1) {
                    cf(index + 1);
                }
            });
        })
    }

    if(paths.length > 0) {
        cf(0);
    }
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