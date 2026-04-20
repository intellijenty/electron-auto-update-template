import { useEffect, useState } from "react";

export default function UpdateToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Download");
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleAction = () => {
    if (isDownloaded) {
      window.electronAPI.installUpdate();
    } else {
      window.electronAPI.downloadUpdate();
    }
  };

  useEffect(() => {
    if (!window.electronAPI) return;

    const removeAvailable = window.electronAPI.onUpdateAvailable((info) => {
      setMessage(`Version ${info.version} is available`);
      setButtonLabel("Download & install");
      setVisible(true);
      setIsDownloaded(false);
      setProgress(0);
    });

    const removeProgress = window.electronAPI.onUpdateProgress((prog) => {
      const percent = Math.round(prog.percent);
      setProgress(percent);
      setMessage(`Downloading update... ${percent}%`);
    });

    const removeDownloaded = window.electronAPI.onUpdateDownloaded((info) => {
      setIsDownloaded(true);
      setMessage(`Version ${info.version} downloaded and ready`);
      setButtonLabel("Restart to update");
      setProgress(100);
    });

    const removeError = window.electronAPI.onUpdateError((errMsg) => {
      console.error("Update error:", errMsg);
      setVisible(false);
    });

    return () => {
      removeAvailable();
      removeProgress();
      removeDownloaded();
      removeError();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="update-toast show">
      <span className="update-toast-message">{message}</span>
      {progress > 0 && progress < 100 && (
        <div className="update-progress-bar">
          <div
            className="update-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <button onClick={handleAction}>{buttonLabel}</button>
      <button className="close-btn" onClick={() => setVisible(false)}>
        ✕
      </button>
    </div>
  );
}
