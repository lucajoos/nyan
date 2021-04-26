const { app, BrowserWindow } = require('electron');
const { URL } = require('./modules/constants')

let window;

let init = () => {
    window = new BrowserWindow({
        width: 800,
        height: 600
    });

    console.log(URL)

    window.loadURL(URL).then(() => {
        console.log('APP LOADED')
    });

    window.on('closed', () => {
        window = null;
    });
}

app.on('ready', init);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (window === null) {
        init();
    }
});