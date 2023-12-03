const { app, BrowserWindow } = require('electron');
const dns = require('dns');
const exec = require('child_process').exec;
const { updateSystemInfo } = require('./updateSystemInfo');
const { handleConnectivity } = require('./handleConnectivity');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation : false
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    updateSystemInfo(mainWindow);
    handleConnectivity(mainWindow);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
