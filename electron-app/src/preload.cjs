// preload.cjs — Bridge seguro entre renderer y proceso principal
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runHeretic: (model, options) => ipcRenderer.invoke("run-heretic", { model, options }),
  checkHeretic: () => ipcRenderer.invoke("check-heretic"),
  installHeretic: () => ipcRenderer.invoke("install-heretic"),
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  onHereticOutput: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on("heretic-output", listener);
    return () => ipcRenderer.removeListener("heretic-output", listener);
  },
});

