// Electron Preload Script
// Exposes safe IPC methods to renderer process

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveCalculation: (data) => ipcRenderer.invoke('save-calculation', data),
  loadCalculations: () => ipcRenderer.invoke('load-calculations'),
  deleteCalculation: (id) => ipcRenderer.invoke('delete-calculation', id),
});
