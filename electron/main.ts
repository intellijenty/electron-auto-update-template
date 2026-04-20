import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import path from "path";

log.transports.file.level = "info";
autoUpdater.logger = log;
autoUpdater.autoDownload = false;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:5274");
  }
}

function setupAutoUpdater() {
  if (!app.isPackaged) return;

  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", (info) => {
    log.info("Update available:", info);
    mainWindow?.webContents.send("update-available", info);
  });

  autoUpdater.on("download-progress", (progress) => {
    mainWindow?.webContents.send("update-progress", progress);
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("Update downloaded:", info);
    mainWindow?.webContents.send("update-downloaded", info);
  });

  autoUpdater.on("error", (err) => {
    log.error("Update error:", err);
    mainWindow?.webContents.send("update-error", err.message);
  });
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  const menu = Menu.buildFromTemplate([
    {
      label: "Help",
      submenu: [
        {
          label: "Check for Updates",
          click: () => autoUpdater.checkForUpdates(),
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC Handlers
ipcMain.handle("get-version", () => app.getVersion());

ipcMain.on("download-update", () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on("install-update", () => {
  autoUpdater.quitAndInstall();
});
