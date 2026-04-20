import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Returns the app version via IPC (works in both dev and packaged builds)
  getVersion: (): Promise<string> => ipcRenderer.invoke("get-version"),

  // Update event listeners — each returns a cleanup function to remove the listener
  onUpdateAvailable: (callback: (info: { version: string }) => void) => {
    const handler = (_: IpcRendererEvent, info: { version: string }) =>
      callback(info);
    ipcRenderer.on("update-available", handler);
    return () => ipcRenderer.removeListener("update-available", handler);
  },

  onUpdateProgress: (callback: (progress: { percent: number }) => void) => {
    const handler = (_: IpcRendererEvent, progress: { percent: number }) =>
      callback(progress);
    ipcRenderer.on("update-progress", handler);
    return () => ipcRenderer.removeListener("update-progress", handler);
  },

  onUpdateDownloaded: (callback: (info: { version: string }) => void) => {
    const handler = (_: IpcRendererEvent, info: { version: string }) =>
      callback(info);
    ipcRenderer.on("update-downloaded", handler);
    return () => ipcRenderer.removeListener("update-downloaded", handler);
  },

  onUpdateError: (callback: (message: string) => void) => {
    const handler = (_: IpcRendererEvent, message: string) =>
      callback(message);
    ipcRenderer.on("update-error", handler);
    return () => ipcRenderer.removeListener("update-error", handler);
  },

  // Actions
  downloadUpdate: () => ipcRenderer.send("download-update"),
  installUpdate: () => ipcRenderer.send("install-update"),
});
