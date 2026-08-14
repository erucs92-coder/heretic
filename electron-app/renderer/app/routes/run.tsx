import { useEffect, useRef, useState } from "react";
import { Sidebar } from "../components/Sidebar";

type LogLine = { type: "stdout" | "stderr" | "info"; text: string };
type Status = "idle" | "running" | "success" | "error";

export default function Run() {
  const [model, setModel] = useState("");
  const [quantization, setQuantization] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (line: LogLine) => setLogs((prev) => [...prev, line]);

  const handleRun = async () => {
    if (!model.trim()) return;
    setLogs([]);
    setStatus("running");
    addLog({ type: "info", text: `▶ Iniciando Heretic con modelo: ${model}` });

    const options: string[] = [];
    if (quantization) options.push("--quantization", quantization);

    const removeListener = window.electronAPI?.onHereticOutput((data) => {
      addLog({ type: data.type, text: data.text.trimEnd() });
    });

    try {
      await window.electronAPI?.runHeretic(model.trim(), options);
      addLog({ type: "info", text: "✅ Proceso completado exitosamente." });
      setStatus("success");
    } catch (err: unknown) {
      const msg = typeof err === "object" && err !== null && "error" in err
        ? String((err as { error: unknown }).error)
        : "Error desconocido";
      addLog({ type: "stderr", text: `❌ Error: ${msg}` });
      setStatus("error");
    } finally {
      removeListener?.();
    }
  };

  const handleStop = () => {
    setStatus("idle");
    addLog({ type: "info", text: "⏹ Proceso detenido." });
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="page-header">
          <h1>Ejecutar Heretic</h1>
          <p>Ingresa el modelo de Hugging Face y lanza el proceso de descensura</p>
        </div>

        <div className="card">
          <h2>Configuración</h2>

          <div className="input-group">
            <label className="input-label">Modelo (Hugging Face ID) *</label>
            <input
              className="input"
              type="text"
              placeholder="ej: Qwen/Qwen3-4B-Instruct-2507"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={status === "running"}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Cuantización (opcional)</label>
            <select
              className="input"
              value={quantization}
              onChange={(e) => setQuantization(e.target.value)}
              disabled={status === "running"}
              style={{ cursor: "pointer" }}
            >
              <option value="">Sin cuantización (default)</option>
              <option value="bnb_4bit">4-bit (bitsandbytes)</option>
              <option value="bnb_8bit">8-bit (bitsandbytes)</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={handleRun}
              disabled={!model.trim() || status === "running"}
            >
              {status === "running" ? (
                <>
                  <span className="dot dot-yellow" /> Ejecutando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Iniciar
                </>
              )}
            </button>
            {status === "running" && (
              <button className="btn btn-secondary" onClick={handleStop}>
                ⏹ Detener
              </button>
            )}
          </div>
        </div>

        {logs.length > 0 && (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ marginBottom: 0 }}>Salida del proceso</h2>
              <span
                className={`badge ${status === "success" ? "badge-green" : status === "error" ? "badge-red" : "badge-yellow"}`}
              >
                <span
                  className={`dot ${status === "success" ? "dot-green" : status === "error" ? "dot-red" : "dot-yellow"}`}
                />
                {status === "running" ? "En progreso" : status === "success" ? "Completado" : "Error"}
              </span>
            </div>
            <div className="terminal" ref={terminalRef}>
              {logs.map((line, i) => (
                <div
                  key={i}
                  className={line.type === "stderr" ? "line-stderr" : line.type === "info" ? "line-info" : ""}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
