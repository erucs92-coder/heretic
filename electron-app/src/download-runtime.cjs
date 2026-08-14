// download-runtime.cjs — Descarga el runtime de Heretic si no está instalado
const { execSync } = require("child_process");
const os = require("os");

function isHereticInstalled() {
  try {
    execSync("heretic --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function downloadRuntime() {
  if (isHereticInstalled()) {
    console.log("Heretic runtime already installed.");
    return;
  }
  console.log("Installing heretic-llm runtime...");
  execSync("pip install --no-cache-dir heretic-llm==1.4.0", {
    stdio: "inherit",
  });
  console.log("Heretic runtime installed successfully.");
}

module.exports = { downloadRuntime };
