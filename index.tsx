import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to mount React application:", error);
  // Remove loader so the error screen from index.html (window.onerror) is visible
  const loader = document.getElementById('loading-fallback');
  if (loader) loader.style.display = 'none';
  throw error;
}
