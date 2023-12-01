const { exec } = require('child_process');
const dns = require('dns');
const  {ipcMain} = require('electron');

let networkActionHistory = [];

ipcMain.on('reset-network-action-history', (event, arg) => {
    networkActionHistory = [];
    
});

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function handleConnectivity (mainWindow){
    
    let isConnected = true;
    setInterval(() => {
        dns.resolve('www.google.com', function(err) {
            if(err) {
                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerText = 'Disconnected';`);
                exec('NETWORK_COMMAND', (err, stdout, stderr) => {
                    let message;
                    if(err) {
                        message = `Error restarting network cards at ${new Date().toLocaleString()}`;
                    } else {
                        message = `Network cards restarted successfully at ${new Date().toLocaleString()}`;
                    }
                    networkActionHistory.push(escapeHtml(message));
                    mainWindow.webContents.executeJavaScript(
                        `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join('<br>')}';`
                    )
                    isConnected = false;
                    
                })
            } else  {
                if (!isConnected) {
                    message = `Network connection restored at ${new Date().toLocaleString()}`;
                    networkActionHistory.push(escapeHtml(message));
                    mainWindow.webContents.executeJavaScript(
                        `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join('<br>')}';`
                    )
                    isConnected = true;
                }
            
               
                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerText = 'Connected';`);
               
               
            }
        })
    }, 1000)
}


module.exports = {handleConnectivity}