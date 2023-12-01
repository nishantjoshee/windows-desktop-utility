const { ipcRenderer } = require('electron');

ipcRenderer.on('internet-status', (event, status) => {
    document.getElementById('internetStatus').innerText = status;
    if (status === 'Disconnected') {
        document.getElementById('networkActionStatus').innerText = 'Attempting to restart network cards...';
    }
});

ipcRenderer.on('network-action', (event, message) => {
    document.getElementById('networkActionStatus').innerText = message;
});
