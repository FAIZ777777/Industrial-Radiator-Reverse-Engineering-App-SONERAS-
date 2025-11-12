const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  saveCalculation: d => ipcRenderer.invoke('save-calculation', d),
  loadCalculations: () => ipcRenderer.invoke('load-calculations'),
  deleteCalculation: id => ipcRenderer.invoke('delete-calculation', id)
});
