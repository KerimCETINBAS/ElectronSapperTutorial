const {
    contextBridge,
    ipcRenderer,
} = require("electron");

// Node modüllerini browser contextine inject eder

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
                ipcRenderer.send(channel, data);
          
        },
        receive: (channel, func) => {

                ipcRenderer.on(channel, (event, ...args) => {
                 
                    func(...args)
                });
            
        },
        electron: require("electron")
    }
);