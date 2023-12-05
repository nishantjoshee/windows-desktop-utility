const ping = require('ping');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

let networkActionHistory = [];
let restartInProgress = false;

function handleConnectivity(mainWindow) {
    let isConnected = true;

    setInterval(async () => {
        ping.sys.probe('www.google.com', async function (isAlive) {
            let message;
            if (!isAlive) {
                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerHTML = '<button type="button" class="btn btn-outline-danger" style="width: 200px;"> Disconnected </button> ';`);
                message = `Internet disconnection detected at ${new Date().toLocaleString()}`;
                networkActionHistory.push(`<p style="color: red;"> ${message} </p>`);

                if (!restartInProgress) {
                    try {
                        restartInProgress = true;
                        const { stdout, stderr } = await exec('powershell -Command "Get-NetAdapter | Restart-NetAdapter"');
                        if (stderr) {
                            console.log(stderr);
                            message = `Error restarting network cards at ${new Date().toLocaleString()}`;
                            networkActionHistory.push(`<p style="color: red;"> ${message} </p>`);
                        } else {
                            message = `Network cards restarted successfully at ${new Date().toLocaleString()}`;
                            networkActionHistory.push(`<p style="color: green;"> ${message} </p>`);
                        }

                        mainWindow.webContents.executeJavaScript(
                            `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join('<br>')}';`
                        );
                        await exec('powershell -Command "Get-NetAdapter | Enable-NetAdapter"')

                        isConnected = false;
                    } catch (e) {
                        console.log(e);
                    } finally {
                        restartInProgress = false;
                    }
                }
            } else {
                if (!isConnected) {
                    message = `Network connection restored at ${new Date().toLocaleString()}`;
                    networkActionHistory.push(`<p style="color: green;"> ${message} </p>`);
                    mainWindow.webContents.executeJavaScript(
                        `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join('<br>')}';`
                    );
                    isConnected = true;
                }

                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerHTML = '<button type="button" class="btn btn-outline-success" style="width: 200px;"> Connected </button> ';`);
            }
        });
    }, 20000);
}

module.exports = { handleConnectivity };
