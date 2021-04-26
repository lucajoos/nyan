const { app, BrowserWindow, globalShortcut } = require('electron');
const { URL } = require('./modules/constants')

let window = null;

let init = () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        show: false
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
}

app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+X', () => {
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