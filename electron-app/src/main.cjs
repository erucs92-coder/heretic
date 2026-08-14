// main.cjs — Proceso principal de Electron
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const { downloadRuntime } = require("./download-runtime.cjs");

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../renderer/build/client/index.html"));
  }
}

// IPC: run heretic with a model
ipcMain.handle("run-heretic", async (event, { model, options = [] }) => {
  return new Promise((resolve, reject) => {
    const args = [model, ...options];
    const proc = spawn("heretic", args, { shell: true });

    let output = "";
    let errorOutput = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
      event.sender.send("heretic-output", { type: "stdout", text: data.toString() });
    });

    proc.stderr.on("data", (data) => {
      errorOutput += data.toString();
      event.sender.send("heretic-output", { type: "stderr", text: data.toString() });
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        reject({ success: false, error: errorOutput, code });
      }
    });

    proc.on("error", (err) => {
      reject({ success: false, error: err.message });
    });
  });
});

// IPC: check if heretic is installed
ipcMain.handle("check-heretic", async () => {
  return new Promise((resolve) => {
    const proc = spawn("heretic", ["--version"], { shell: true });
    proc.on("close", (code) => resolve(code === 0));
    proc.on("error", () => resolve(false));
  });
});

// IPC: install heretic runtime
ipcMain.handle("install-heretic", async (event) => {
  return new Promise((resolve, reject) => {
    const proc = spawn("pip", ["install", "--no-cache-dir", "heretic-llm==1.4.0"], { shell: true });
    proc.stdout.on("data", (data) => {
      event.sender.send("heretic-output", { type: "stdout", text: data.toString() });
    });
    proc.stderr.on("data", (data) => {
      event.sender.send("heretic-output", { type: "stderr", text: data.toString() });
    });
    proc.on("close", (code) => {
      code === 0 ? resolve({ success: true }) : reject({ success: false });
    });
  });
});

// IPC: open external URL
ipcMain.handle("open-external", (_event, url) => {
  shell.openExternal(url);
});

app.whenReady().then(async () => {
  await downloadRuntime().catch(() => {});
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

