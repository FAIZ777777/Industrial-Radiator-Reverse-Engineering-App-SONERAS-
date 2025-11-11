// Electron Main Process
// This file is ready for Electron desktop app deployment

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    titleBarStyle: 'default',
    backgroundColor: '#f9fafb',
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers for File System Operations
ipcMain.handle('save-calculation', async (event, data) => {
  const userDataPath = app.getPath('userData');
  const calculationsDir = path.join(userDataPath, 'calculations');
  
  if (!fs.existsSync(calculationsDir)) {
    fs.mkdirSync(calculationsDir, { recursive: true });
  }
  
  const filePath = path.join(calculationsDir, `${data.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  return { success: true, path: filePath };
});

ipcMain.handle('load-calculations', async () => {
  const userDataPath = app.getPath('userData');
  const calculationsDir = path.join(userDataPath, 'calculations');
  
  if (!fs.existsSync(calculationsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(calculationsDir);
  const calculations = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(calculationsDir, file), 'utf-8');
      return JSON.parse(content);
    });
  
  return calculations;
});

ipcMain.handle('delete-calculation', async (event, id) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'calculations', `${id}.json`);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return { success: true };
  }
  
  return { success: false, error: 'File not found' };
});
