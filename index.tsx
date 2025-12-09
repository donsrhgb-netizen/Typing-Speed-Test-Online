import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const loadingFallback = document.getElementById('loading-fallback');

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

  // Remove loader once React has scheduled the render
  // Use a small timeout to ensure the painting has begun
  setTimeout(() => {
    if (loadingFallback) {
      loadingFallback.style.opacity = '0';
      setTimeout(() => loadingFallback.remove(), 500);
    }
  }, 100);

} catch (error) {
  console.error("Failed to mount React application:", error);
  // Re-throw so window.onerror in index.html catches it and displays it
  throw error;
}