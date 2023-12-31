const ping = require("ping");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

let networkActionHistory = [];
let restartInProgress = false;

function handleConnectivity(mainWindow) {
  let isConnected = true;

  setInterval(async () => {
    ping.sys.probe("www.45645cnkogle.comm", async function (isAlive) {
      let message;
      if (!isAlive) {
        mainWindow.webContents.executeJavaScript(
          `document.getElementById('internetStatus').innerHTML = '<button type="button" class="btn btn-outline-danger" style="width: 200px;"> Disconnected </button> ';`
        );
        message = `Internet disconnection detected at ${new Date().toLocaleString()}`;
        networkActionHistory.push(`<p style="color: red;"> ${message} </p>`);

        if (!restartInProgress) {
          try {
            restartInProgress = true;

            const { stdout, stderr } = await exec(
              'powershell -Command "Get-NetAdapter | Restart-NetAdapter -Confirm:$false"'

            );
        
            // const { out, err } = await exec(
            //   'powershell -Command "Get-NetAdapter | Disable-NetAdapter -Confirm:$false"'

            // );
            // const { stdout, stderr } = await exec(
            //   'powershell -Command "Get-NetAdapter | Enable-NetAdapter -Confirm:$false"'

            // );
            if (stderr) {
              message = `Error restarting network cards at ${new Date().toLocaleString()}`;
              networkActionHistory.push(
                `<p style="color: red;"> ${message} </p>`
              );
            } else {
              message = `Network cards restarted successfully at ${new Date().toLocaleString()}`;
              networkActionHistory.push(
                `<p style="color: green;"> ${message} </p>`
              );
            }

            mainWindow.webContents.executeJavaScript(
              `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join(
                "<br>"
              )}';`
            );
            

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
          networkActionHistory.push(
            `<p style="color: green;"> ${message} </p>`
          );
          mainWindow.webContents.executeJavaScript(
            `document.getElementById('networkRestartHistory').innerHTML = '${networkActionHistory.join(
              "<br>"
            )}';`
          );
          isConnected = true;
        }

        mainWindow.webContents.executeJavaScript(
          `document.getElementById('internetStatus').innerHTML = '<button type="button" class="btn btn-outline-success" style="width: 200px;"> Connected </button> ';`
        );
      }
    });
  }, 20000);
}

module.exports = { handleConnectivity };
