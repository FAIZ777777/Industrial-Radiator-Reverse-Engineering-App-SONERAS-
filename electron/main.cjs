const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    backgroundColor: '#f9fafb',
  });

  // Check if we're in development mode
  const isDev = !app.isPackaged;

  if (isDev) {
    // In development, load from Vite dev server
    win.loadURL('http://localhost:8080');
    // Open DevTools in development
    win.webContents.openDevTools();
  } else {
    // In production, load from built files
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle loading errors
  win.webContents.on('did-fail-load', () => {
    console.log('Failed to load. Retrying...');
    setTimeout(() => {
      if (isDev) {
        win.loadURL('http://localhost:8080');
      }
    }, 1000);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});