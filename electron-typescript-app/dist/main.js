"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
let mainWindow;
// Function to create the main window
function createWindow() {
    mainWindow !== null && mainWindow !== void 0 ? mainWindow : (mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: __dirname + '/preload.js',
            nodeIntegration: true,
            contextIsolation: false
        }
    }));
    mainWindow.loadFile('src/index.html');
    mainWindow.webContents.openDevTools();
}
function captureScreenshot() {
    return __awaiter(this, void 0, void 0, function* () {
        const sources = yield electron_1.desktopCapturer.getSources({ types: ['screen'] });
        if (sources === null || sources === undefined) {
            return Promise.reject(new Error('No screen source found.'));
        }
        const screenSource = sources[0];
        if (screenSource === null || screenSource === undefined) {
            return Promise.reject(new Error('No screen source found.'));
        }
        const image = yield mainWindow.webContents.capturePage();
        if (image === null || image === undefined) {
            return Promise.reject(new Error('Failed to capture screenshot.'));
        }
        const screenshotPath = path.join(electron_1.app.getPath('desktop'), 'screenshot.png');
        const buffer = image.toPNG();
        if (buffer === null || buffer === undefined) {
            return Promise.reject(new Error('Failed to convert screenshot to PNG.'));
        }
        try {
            fs.writeFileSync(screenshotPath, buffer);
        }
        catch (err) {
            return Promise.reject(new Error(`Failed to save screenshot: ${err}`));
        }
        return screenshotPath;
    });
}
electron_1.ipcMain.handle('capture-screenshot', () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = yield captureScreenshot();
    return filePath;
}));
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map