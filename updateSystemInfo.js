const osu = require('os-utils');
const os = require('os');

function updateSystemInfo(mainWindow) {
    osu.cpuUsage(function(v){
        mainWindow.webContents.executeJavaScript(`document.getElementById('cpuUsage').innerText = '${(v * 100).toFixed(2)}%';`);
    });
    
    mainWindow.webContents.executeJavaScript(`document.getElementById('freeMemory').innerText = '${(osu.freememPercentage() * 100).toFixed(2)}%';`);
    mainWindow.webContents.executeJavaScript(`document.getElementById('platform').innerText = '${os.platform()}';`);
}

module.exports = { updateSystemInfo };
