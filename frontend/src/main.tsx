import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { AppContextProvider } from "./context/app-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </AppContextProvider>
  </React.StrictMode>
);
