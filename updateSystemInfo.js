const osu = require('os-utils');
const os = require('os');

function updateSystemInfo(mainWindow) {

    setInterval(() => {
        osu.cpuUsage(function (v) {
            let cpuUsage = (v * 100).toFixed(2);
            if(cpuUsage > 50 && cpuUsage < 80) {
                mainWindow.webContents.executeJavaScript(`document.getElementById('cpuUsage').innerHTML = '<button type="button" class="btn btn-outline-warning" style="width: 150px;"> ${cpuUsage} % </button>';`);
            }
            if(cpuUsage > 80) {
                mainWindow.webContents.executeJavaScript(`document.getElementById('cpuUsage').innerHTML = '<button type="button" class="btn btn-outline-danger"  style="width: 150px;"> ${cpuUsage} % </button>';`);
            }
            mainWindow.webContents.executeJavaScript(`document.getElementById('cpuUsage').innerHTML = '<button type="button" class="btn btn-outline-primary"  style="width: 150px;"> ${cpuUsage} % </button>';`);
        });

        let freeMemory = (osu.freememPercentage() * 100).toFixed(2);
        if(freeMemory < 30 && freeMemory > 10) {
            mainWindow.webContents.executeJavaScript(`document.getElementById('freeMemory').innerHTML = '<button type="button" class="btn btn-outline-warning" style="width: 150px;"> ${freeMemory} % </button>';`);
        }
        if(freeMemory < 10) {
            mainWindow.webContents.executeJavaScript(`document.getElementById('freeMemory').innerHTML = '<button type="button" class="btn btn-outline-danger" style="width: 150px;"> ${freeMemory} % </button>';`);
        }
        mainWindow.webContents.executeJavaScript(`document.getElementById('platform').innerText = '${os.platform()}';`);
    }, 1000);

}

module.exports = { updateSystemInfo };



