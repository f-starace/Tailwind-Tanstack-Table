import React from "react";
import ReactDOM from "react-dom/client";
import Example from "./example";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <main className="max-w-7xl mx-auto px-10">
      <Example />
    </main>
  </React.StrictMode>
);
