import React from "react";
import ReactDOM from "react-dom/client"; // Ensure correct import
import App from "./App";
import "./styles.css"; // Import your CSS

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Use createRoot for React 18
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
