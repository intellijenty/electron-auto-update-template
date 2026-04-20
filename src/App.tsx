import { useEffect, useState } from "react";
import UpdateToast from "./UpdateToast";
import "./App.css";

function App() {
  const [version, setVersion] = useState("dev");

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(setVersion);
    }
  }, []);

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Hello World</h1>
        <p className="app-description">
          Electron app template with Vite + React and GitHub auto-updates.
        </p>
        <p className="app-version">
          Current Version: <span className="version-badge">{version}</span>
        </p>
        <div className="app-note">
          Updates are checked automatically on launch.
          <br />A blue toast will appear when a new version is available.
          <br />And here we go... plz
        </div>
      </div>
      <UpdateToast />
    </div>
  );
}

export default App;
