/// <reference types="vite/client" />

interface ElectronAPI {
  getVersion: () => Promise<string>;
  onUpdateAvailable: (callback: (info: { version: string }) => void) => () => void;
  onUpdateProgress: (callback: (progress: { percent: number }) => void) => () => void;
  onUpdateDownloaded: (callback: (info: { version: string }) => void) => () => void;
  onUpdateError: (callback: (message: string) => void) => () => void;
  downloadUpdate: () => void;
  installUpdate: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
