# Electron Auto-Update Template

A minimal Electron app template with GitHub auto-updates, built with Vite + React + TypeScript.

When a new version is published to GitHub Releases, running instances of the app will automatically check for it on launch. A blue toast appears at the top of the window — the user clicks to download, then clicks again to restart and install. Same experience as Notion.

## Stack

- **Electron** — desktop shell
- **Vite + React + TypeScript** — renderer (hot-reload in dev)
- **electron-updater** — auto-update via GitHub Releases
- **electron-builder** — packaging and publishing
- **GitHub Actions** — CI builds the Windows installer and publishes it on every version tag

---

## Getting started

```bash
git clone <your-repo-url>
cd <your-repo>
npm install
npm run dev
```

`npm run dev` starts the Vite dev server on port `5274` and launches Electron pointing at it. Changes to React code hot-reload instantly. Changes to `electron/main.ts` or `electron/preload.ts` require re-running `npm run dev`.

---

## Before publishing — one-time setup

### 1. Update `package.json`

```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name",
    "publish": [
      {
        "provider": "github",
        "owner": "your-github-username",
        "repo": "your-repo-name"
      }
    ]
  }
}
```

### 2. Add an app icon

Place a `256×256` (minimum) `.ico` file at `build/icon.ico`. electron-builder uses this for the installer and taskbar icon.

### 3. Make the GitHub repo public

electron-updater checks the GitHub Releases API to find updates. The repo must be **public**, or you need a `GH_TOKEN` secret with repo read access.

### 4. Enable `GITHUB_TOKEN` write permissions (one time per repo)

Go to your repo → **Settings → Actions → General → Workflow permissions** → select **Read and write permissions**.

This allows the `publish.yml` workflow to create a GitHub Release and upload the installer.

---

## Publishing a new version

```bash
# 1. Bump the version in package.json
#    e.g. 1.0.0 → 1.0.1

# 2. Commit, tag, and push
git add package.json
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push && git push --tags
```

GitHub Actions will trigger on the `v*` tag, build the Windows installer, and publish it as a GitHub Release. Running instances of your app will detect the new release on next launch.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server + launch Electron |
| `npm run typecheck` | Full TypeScript check across all configs |
| `npm run build:renderer` | Build React app → `dist/` |
| `npm run build:electron` | Compile Electron TS → `dist-electron/` |
| `npm run build` | Full build + package Windows installer → `release/` |
| `npm run publish` | Full build + publish to GitHub Releases |

---

## Project structure

```
├── electron/
│   ├── main.ts        # Main process: window, auto-updater, IPC handlers
│   └── preload.ts     # Context bridge: exposes safe API to renderer
├── src/
│   ├── App.tsx        # Main React component
│   ├── UpdateToast.tsx # Auto-update UI (toast notification)
│   ├── vite-env.d.ts  # ElectronAPI type declarations for the renderer
│   └── index.css      # Global styles including toast styles
├── .github/workflows/
│   └── publish.yml    # CI: builds and publishes on version tags
└── package.json       # electron-builder config lives here under "build"
```

---

## How auto-update works

1. On app launch, `main.ts` calls `autoUpdater.checkForUpdates()` (packaged builds only)
2. If a newer version exists on GitHub Releases, `update-available` fires → sent to renderer via IPC
3. `UpdateToast.tsx` shows a blue toast with a **Download & install** button
4. User clicks → `autoUpdater.downloadUpdate()` → progress updates stream in
5. Download complete → toast changes to **Restart to update**
6. User clicks → `autoUpdater.quitAndInstall()` → app restarts with new version

Updates are **manual-trigger** (user clicks download). Set `autoUpdater.autoDownload = true` in `main.ts` to download silently in the background instead.
