import { app, BrowserWindow, desktopCapturer, ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

// Setup electron-reload with the path to the Electron executable
const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

// Enable electron-reload only in development mode
if (process.env.NODE_ENV === 'development') {
  const electronReload = require('electron-reload');
  electronReload(__dirname, {
    electron: electronPath,
    awaitWriteFinish: true
  });
}

let mainWindow: BrowserWindow;

// Function to create the main window
function createWindow() {
  mainWindow ??= new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js',
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('src/index.html');
  mainWindow.webContents.openDevTools();
}
async function captureScreenshot(): Promise<string> {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });

  if (sources === null || sources === undefined) {
    return Promise.reject(new Error('No screen source found.'));
  }

  const screenSource = sources[0];

  if (screenSource === null || screenSource === undefined) {
    return Promise.reject(new Error('No screen source found.'));
  }

  const image = await mainWindow.webContents.capturePage();

  if (image === null || image === undefined) {
    return Promise.reject(new Error('Failed to capture screenshot.'));
  }

  const screenshotPath = path.join(app.getPath('desktop'), 'screenshot.png');

  const buffer = image.toPNG();

  if (buffer === null || buffer === undefined) {
    return Promise.reject(new Error('Failed to convert screenshot to PNG.'));
  }

  try {
    fs.writeFileSync(screenshotPath, buffer);
  } catch (err) {
    return Promise.reject(new Error(`Failed to save screenshot: ${err}`));
  }

  return screenshotPath;
}


ipcMain.handle('capture-screenshot', async () => {
  const filePath = await captureScreenshot();
  return filePath;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
