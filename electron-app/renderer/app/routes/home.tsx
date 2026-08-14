import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Sidebar } from "../components/Sidebar";

export default function Home() {
  const [hereticInstalled, setHereticInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    window.electronAPI?.checkHeretic().then(setHereticInstalled);
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="page-header">
          <h1>🔥 Heretic LLM</h1>
          <p>Eliminación automática de censura en modelos de lenguaje</p>
        </div>

        <div className="card">
          <h2>Estado del sistema</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              className={`badge ${hereticInstalled === null ? "badge-yellow" : hereticInstalled ? "badge-green" : "badge-red"}`}
            >
              <span
                className={`dot ${hereticInstalled === null ? "dot-yellow" : hereticInstalled ? "dot-green" : "dot-red"}`}
              />
              {hereticInstalled === null
                ? "Verificando..."
                : hereticInstalled
                  ? "heretic-llm instalado"
                  : "heretic-llm no encontrado"}
            </span>
          </div>
          {hereticInstalled === false && (
            <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
              Ve a{" "}
              <Link to="/settings" style={{ color: "var(--accent)" }}>
                Configuración
              </Link>{" "}
              para instalar el runtime de Heretic.
            </p>
          )}
        </div>

        <div className="grid-2">
          <div className="card">
            <h2>¿Qué es Heretic?</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Heretic elimina la censura de modelos de lenguaje transformer sin
              necesidad de re-entrenamiento costoso. Combina ablación direccional
              avanzada con un optimizador TPE basado en Optuna.
            </p>
          </div>

          <div className="card">
            <h2>Inicio rápido</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
              Escribe el nombre del modelo de Hugging Face que quieres procesar y
              deja que Heretic haga el trabajo automáticamente.
            </p>
            <Link to="/run">
              <button className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ejecutar Heretic
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
