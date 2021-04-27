const exec = require('child_process').exec;
const fetch  = require('node-fetch');

let t = () => {
    fetch('http://localhost:5000')
        .then(() => {
            console.log('Starting Electron');
            exec('yarn run start:electron');
        })
        .catch(() => {
            setTimeout(t, 1000)
        })
}

t();
