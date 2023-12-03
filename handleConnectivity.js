const { exec } = require('child_process');
const dns = require('dns');

let networkActionHistory = [];

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
                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerHTML = '<button type="button" class="btn btn-outline-danger" style="width: 200px;"> Disconnected </button> ';`);
                exec('NETWORK_COMMAND', (err, stdout, stderr) => {
                    let message;
                    if(err) {
                        message = `Error restarting network cards at ${new Date().toLocaleString()}`;
                    } else {
                        message = `Network cards restarted successfully at ${new Date().toLocaleString()}`;
                    }
                    networkActionHistory.push(`<p style="color: red;"> ${message} </p>`);
                    mainWindow.webContents.executeJavaScript(
                        `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join('<br>')}';`
                    )
                    
                    isConnected = false;
                    
                })
            } else  {
                if (!isConnected) {
                    message = `Network connection restored at ${new Date().toLocaleString()}`;
                    networkActionHistory.push(`<p style="color: green;"> ${message} </p>`);
                    mainWindow.webContents.executeJavaScript(
                        `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join('<br>')}';`
                    )
                    isConnected = true;
                }
            
               
                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerHTML = '<button type="button" class="btn btn-outline-success" style="width: 200px;"> Connected </button> ';`);
               
               
            }
        })
    }, 1000)
}


module.exports = {handleConnectivity}