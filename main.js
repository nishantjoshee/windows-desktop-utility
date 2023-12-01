const { app, BrowserWindow } = require('electron');
const osu = require('os-utils');
const os = require('os');
const dns = require('dns');
const exec = require('child_process').exec;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Fetch system information and check internet status every second
    setInterval(() => {
        updateSystemInformation();
        checkInternetConnectivity();
    }, 1000);
}

function updateSystemInformation() {
    osu.cpuUsage(function(v){
        mainWindow.webContents.executeJavaScript(`document.getElementById('cpuUsage').innerText = '${(v * 100).toFixed(2)}%';`);
    });
    
    mainWindow.webContents.executeJavaScript(`document.getElementById('freeMemory').innerText = '${(osu.freememPercentage() * 100).toFixed(2)}%';`);
    mainWindow.webContents.executeJavaScript(`document.getElementById('platform').innerText = '${os.platform()}';`);
}

function checkInternetConnectivity() {
    dns.resolve('www.google.com', function(err) {
        if (err) {
            mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerText = 'Disconnected';`);
            restartNetworkCards();
        } else {
            mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerText = 'Connected';`);
        }
    });
}

function restartNetworkCards() {
    // The command to restart network cards will depend on the OS and configuration
    // Example for Windows: 'ipconfig /release && ipconfig /renew'
    exec('YOUR_NETWORK_RESTART_COMMAND', (err, stdout, stderr) => {
        if (err) {
            mainWindow.webContents.executeJavaScript(`document.getElementById('networkActionStatus').innerText = 'Error restarting network cards';`);
            return;
        }
        mainWindow.webContents.executeJavaScript(`document.getElementById('networkActionStatus').innerText = 'Network cards restarted successfully';`);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
