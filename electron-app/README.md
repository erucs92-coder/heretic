# Heretic App — Electron Desktop

App de escritorio para [Heretic LLM](https://github.com/p-e-w/heretic).

## Estructura

```
electron-app/
├── src/
│   ├── main.cjs              # Proceso principal Electron + IPC
│   ├── preload.cjs           # Bridge seguro renderer ↔ main
│   └── download-runtime.cjs # Verifica/instala heretic-llm
├── renderer/                 # App React Router (frontend)
│   ├── app/
│   │   ├── routes/
│   │   │   ├── home.tsx      # Pantalla principal
│   │   │   ├── run.tsx       # Ejecutar Heretic
│   │   │   └── settings.tsx  # Configuración e instalación
│   │   ├── components/
│   │   │   └── Sidebar.tsx
│   │   ├── app.css
│   │   ├── root.tsx
│   │   └── routes.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── react-router.config.ts
│   └── tsconfig.json
└── package.json
```

## Instalación y uso

### Requisitos
- Node.js 18+
- Python 3.10+ con `pip`
- PyTorch instalado según tu hardware

### Instalar dependencias

```bash
# Dependencias del proceso principal
cd electron-app
npm install

# Dependencias del renderer
npm --prefix renderer install
```

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build         # Linux + Windows + Mac
npm run build:linux   # Solo Linux (.AppImage + .deb)
npm run build:win     # Solo Windows (.exe)
```
