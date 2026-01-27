import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const checkForUpdates = async () => {
  try {
    const response = await fetch('/', { cache: 'no-store' });
    const html = await response.text();
    const match = html.match(/<meta name="app-version" content="([^"]+)"/);

    if (match) {
      const serverVersion = match[1];
      const currentVersion = document.querySelector('meta[name="app-version"]')?.getAttribute('content');

      if (currentVersion && serverVersion !== currentVersion && serverVersion !== 'BUILD_TIMESTAMP') {
        console.log('[Update] Nova versão detectada. Atualizando...');
        window.location.reload();
        return true;
      }
    }
  } catch (error) {
    console.error('[Update] Erro ao verificar atualizações:', error);
  }
  return false;
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      setInterval(async () => {
        const updated = await checkForUpdates();
        if (!updated) {
          registration.update();
        }
      }, 30000);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] Nova versão disponível! Atualizando...');
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });
    }).catch((error) => {
      console.error('[SW] Falha ao registrar:', error);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[SW] Aplicando nova versão...');
        window.location.reload();
      }
    });

    checkForUpdates();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
