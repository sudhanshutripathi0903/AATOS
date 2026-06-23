import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Strict fallback check for Codespaces environment
const container = document.getElementById("root");

if (!container) {
  console.error("❌ CRITICAL ERROR: Root element '#root' not found in HTML!");
  // Auto-inject root if it's missing to prevent blank screen
  const fallbackRoot = document.createElement("div");
  fallbackRoot.id = "root";
  document.body.appendChild(fallbackRoot);
  
  const root = createRoot(fallbackRoot);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}