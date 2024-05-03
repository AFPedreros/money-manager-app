import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.tsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="min-h-screen w-full bg-background text-foreground dark">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
);