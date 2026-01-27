import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

let isReloading = false;

const hasOldCaches = async () => {
  try {
    const cacheNames = await caches.keys();
    return cacheNames.some(name =>
      name.includes('ultimatecar3d-v3') ||
      name.includes('ultimatecar3d-v4') ||
      name.includes('ultimatecar3d-v5')
    );
  } catch {
    return false;
  }
};

const clearOldCachesOnly = async () => {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name =>
      name.includes('ultimatecar3d-v3') ||
      name.includes('ultimatecar3d-v4') ||
      name.includes('ultimatecar3d-v5')
    );

    if (oldCaches.length > 0) {
      await Promise.all(oldCaches.map(name => caches.delete(name)));
      console.log('[Cache] Caches antigos removidos:', oldCaches);
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Cache] Erro ao limpar caches:', error);
    return false;
  }
};

const forceCleanReload = async () => {
  const hasOld = await hasOldCaches();

  if (hasOld) {
    console.log('[Limpeza] Detectados caches antigos. Limpando...');
    await clearOldCachesOnly();
    console.log('[Limpeza] Recarregando...');
    window.location.reload();
    return true;
  }
  return false;
};

const checkForUpdates = async () => {
  if (isReloading) return false;

  try {
    const response = await fetch('/', { cache: 'no-store' });
    const html = await response.text();
    const match = html.match(/<meta name="app-version" content="([^"]+)"/);

    if (match) {
      const serverVersion = match[1];
      const currentVersion = document.querySelector('meta[name="app-version"]')?.getAttribute('content');

      if (currentVersion && serverVersion !== currentVersion && serverVersion !== 'BUILD_TIMESTAMP') {
        console.log('[Update] Nova versão detectada. Atualizando...');
        isReloading = true;
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
  window.addEventListener('load', async () => {
    const needsReload = await forceCleanReload();
    if (needsReload) return;

    navigator.serviceWorker.register('/sw.js').then((registration) => {
      setInterval(async () => {
        if (!isReloading) {
          const updated = await checkForUpdates();
          if (!updated) {
            registration.update();
          }
        }
      }, 120000);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller && !isReloading) {
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
      if (!refreshing && !isReloading) {
        refreshing = true;
        isReloading = true;
        console.log('[SW] Aplicando nova versão...');
        window.location.reload();
      }
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
