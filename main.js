const fs = require('fs');
const path = require('path');
const gifFrames = require('gif-frames');
const { app, BrowserWindow, globalShortcut, ipcMain, clipboard } = require('electron');
const { URL, RESOURCES_PATH, PREVIEWS_PATH } = require('./modules/constants')
const Store = require('electron-store');

if (require('electron-squirrel-startup')) return app.quit();

let window = null;

if(!fs.existsSync(RESOURCES_PATH)){
    fs.mkdirSync(RESOURCES_PATH);
}

if(!fs.existsSync(PREVIEWS_PATH)){
    fs.mkdirSync(PREVIEWS_PATH);
}

const store = new Store();

if(!store.get('length')) {
    store.set('length', 0);
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
            fs.writeFile(tp, text, {encoding: 'utf-8'}, () => {
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
})

ipcMain.on('drop', (event, paths) => {
    let cf = index => {
        const cc = store.get('length') + 1;

        const file = paths[index];
        const ex = path.basename(file).split('.');
        const fx = ex[ex.length - 1];

        const pt = `${cc}.${fx}`;
        const fp = path.join(RESOURCES_PATH, pt);

        store.set('length', cc);

        if(/(png|jpg|jpeg|svg|gif|txt)/.test(fx)) {
            fs.copyFile(file, fp, error => {
                if(error) throw error;

                event.sender.send('new', {
                    path: fp,
                    editing: false
                });

                if(/gif/.test(fx)) {
                    gifFrames({ url: file, frames: 0}).then(data => {
                        data[0].getImage().pipe(
                            fs.createWriteStream(path.join(PREVIEWS_PATH, `${cc}.jpg`))
                        );

                        if(index < paths.length - 1) {
                            cf(index + 1);
                        }
                    }).catch(error => {
                        throw error;
                    });
                } else {
                    if(index < paths.length - 1) {
                        cf(index + 1);
                    }
                }
            });
        }
    }

    if(paths.length > 0) {
        cf(0);
    }
});

ipcMain.on('get-files', event => {
    event.reply('get-files-reply', fs.readdirSync(RESOURCES_PATH).map(file => {
        return {
            path: path.join(RESOURCES_PATH, file),
            editing: false
        }
    }).reverse());
});

ipcMain.on('copy', (event, file) => {
    if(file) {
        const bn = path.basename(file).split('.');
        const ex = bn[bn.length - 1];

        if(/(png|jpg|jpeg|svg)/.test(ex)) {
            clipboard.writeImage(file);
        } else if(/gif/.test(ex)) {
            const bn = path.basename(file).split('.');
            const nm = bn.splice(0, bn.length - 1).join('.');

            clipboard.writeImage(path.join(PREVIEWS_PATH, `${nm}.jpg`));
        } else if(/(txt)/.test(ex)) {
            fs.readFile(file, {encoding: 'utf-8'}, (error, data) => {
                clipboard.writeText(data.toString());
            });
        }

        if(!!window) {
            window.close();
        }
    }
});

ipcMain.on('new', (event, data) => {
    const cc = store.get('length') + 1;
    const pt = `${cc}.txt`;
    const fp = path.join(RESOURCES_PATH, pt);

    store.set('length', cc);

    fs.writeFile(fp, data, {encoding: 'utf-8'}, error => {
        if(error) throw error;

        event.sender.send('new', {
            path: fp,
            created: true
        });
    });
});

ipcMain.on('remove', (event, file) => {
    if(file) {
        const ex = path.basename(file).split('.');
        const fx = ex[ex.length - 1];
        const nm = ex.splice(0, ex.length - 1).join('.');

        if(/gif/.test(fx)) {
            try {
                fs.unlinkSync(path.join(PREVIEWS_PATH, `${nm}.jpg`));
            } catch(e) {
                console.error(e);
            }
        }

        try {
            fs.unlinkSync(file);
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