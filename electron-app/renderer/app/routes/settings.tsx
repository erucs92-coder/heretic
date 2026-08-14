import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";

type LogLine = { type: "stdout" | "stderr" | "info"; text: string };

export default function Settings() {
  const [hereticInstalled, setHereticInstalled] = useState<boolean | null>(null);
  const [installing, setInstalling] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);

  const checkInstall = () => {
    setHereticInstalled(null);
    window.electronAPI?.checkHeretic().then(setHereticInstalled);
  };

  useEffect(() => {
    checkInstall();
  }, []);

  const handleInstall = async () => {
    setInstalling(true);
    setLogs([{ type: "info", text: "▶ Instalando heretic-llm==1.4.0..." }]);

    const removeListener = window.electronAPI?.onHereticOutput((data) => {
      setLogs((prev) => [...prev, { type: data.type, text: data.text.trimEnd() }]);
    });

    try {
      await window.electronAPI?.installHeretic();
      setLogs((prev) => [...prev, { type: "info", text: "✅ heretic-llm instalado correctamente." }]);
      checkInstall();
    } catch {
      setLogs((prev) => [...prev, { type: "stderr", text: "❌ Error al instalar. Asegúrate de tener pip disponible." }]);
    } finally {
      setInstalling(false);
      removeListener?.();
    }
  };

  const openHuggingFace = () => {
    window.electronAPI?.openExternal("https://huggingface.co/heretic-org");
  };

  const openGitHub = () => {
    window.electronAPI?.openExternal("https://github.com/p-e-w/heretic");
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="page-header">
          <h1>Configuración</h1>
          <p>Gestiona el runtime de Heretic y recursos externos</p>
        </div>

        <div className="card">
          <h2>Runtime de Heretic</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span
              className={`badge ${hereticInstalled === null ? "badge-yellow" : hereticInstalled ? "badge-green" : "badge-red"}`}
            >
              <span
                className={`dot ${hereticInstalled === null ? "dot-yellow" : hereticInstalled ? "dot-green" : "dot-red"}`}
              />
              {hereticInstalled === null
                ? "Verificando..."
                : hereticInstalled
                  ? "heretic-llm v1.4.0 instalado"
                  : "No instalado"}
            </span>
            <button className="btn btn-secondary" onClick={checkInstall} style={{ padding: "6px 12px" }}>
              Verificar
            </button>
          </div>

          {!hereticInstalled && hereticInstalled !== null && (
            <button
              className="btn btn-primary"
              onClick={handleInstall}
              disabled={installing}
            >
              {installing ? (
                <>
                  <span className="dot dot-yellow" /> Instalando...
                </>
              ) : (
                "Instalar heretic-llm"
              )}
            </button>
          )}

          {logs.length > 0 && (
            <div className="terminal" style={{ marginTop: 16 }}>
              {logs.map((line, i) => (
                <div
                  key={i}
                  className={line.type === "stderr" ? "line-stderr" : line.type === "info" ? "line-info" : ""}
                >
                  {line.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Recursos</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={openGitHub}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
              </svg>
              GitHub
            </button>
            <button className="btn btn-secondary" onClick={openHuggingFace}>
              🤗 Hugging Face
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Acerca de</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--text)" }}>Heretic App</strong> v1.0.0<br />
            Basado en <strong style={{ color: "var(--text)" }}>heretic-llm</strong> v1.4.0<br />
            Licencia AGPL-3.0
          </p>
        </div>
      </main>
    </div>
  );
}
