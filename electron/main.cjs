// ==============================================
// Electron Main Process
// Production-Ready Desktop App
// ==============================================

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// 🪟 Create Main Application Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#f9fafb',
    titleBarStyle: 'default',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 📦 Load Production Build
  const indexPath = path.resolve(__dirname, '../dist/index.html');

  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else {
    console.error('Error: dist/index.html not found. Run "npm run build" first.');
    mainWindow.loadURL('about:blank'); // fallback
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 🧩 App Ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 🧹 Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ==============================================
// IPC HANDLERS – File System Operations
// ==============================================

ipcMain.handle('save-calculation', async (event, data) => {
  try {
    const userDataPath = app.getPath('userData');
    const calculationsDir = path.join(userDataPath, 'calculations');

    if (!fs.existsSync(calculationsDir)) {
      fs.mkdirSync(calculationsDir, { recursive: true });
    }

    const filePath = path.join(calculationsDir, `${data.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return { success: true, path: filePath };
  } catch (err) {
    console.error('Error saving calculation:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('load-calculations', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const calculationsDir = path.join(userDataPath, 'calculations');

    if (!fs.existsSync(calculationsDir)) return [];

    const files = fs.readdirSync(calculationsDir);
    const calculations = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const content = fs.readFileSync(path.join(calculationsDir, file), 'utf-8');
        return JSON.parse(content);
      });

    return calculations;
  } catch (err) {
    console.error('Error loading calculations:', err);
    return [];
  }
});

ipcMain.handle('delete-calculation', async (event, id) => {
  try {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, 'calculations', `${id}.json`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }

    return { success: false, error: 'File not found' };
  } catch (err) {
    console.error('Error deleting calculation:', err);
    return { success: false, error: err.message };
  }
});
