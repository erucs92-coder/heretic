// preload.cjs — Bridge seguro entre renderer y proceso principal
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runHeretic: (model) => ipcRenderer.invoke("run-heretic", model),
  onHereticOutput: (callback) =>
    ipcRenderer.on("heretic-output", (_event, data) => callback(data)),
});
