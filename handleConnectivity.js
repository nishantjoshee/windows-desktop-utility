const dns = require('dns');


function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function handleConnectivity (mainWindow){
    setInterval(() => {
        dns.resolve('www.google.com', function(err) {
            if(err) {
                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerText = 'Disconnected';`);
            } else  {
                mainWindow.webContents.executeJavaScript(`document.getElementById('internetStatus').innerText = 'Connected';`);
            }
        })
    }, 1000)
}


module.exports = {handleConnectivity}