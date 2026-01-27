import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

let isReloading = false;

const clearAllCaches = async () => {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[Cache] Todos os caches foram limpos');
  } catch (error) {
    console.error('[Cache] Erro ao limpar caches:', error);
  }
};

const unregisterAllServiceWorkers = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(reg => reg.unregister()));
    console.log('[SW] Todos os service workers foram removidos');
  } catch (error) {
    console.error('[SW] Erro ao remover service workers:', error);
  }
};

const forceCleanReload = async () => {
  const hasCleanedBefore = sessionStorage.getItem('sw_cleaned');

  if (!hasCleanedBefore) {
    console.log('[Limpeza] Iniciando limpeza completa...');
    sessionStorage.setItem('sw_cleaned', 'true');

    await clearAllCaches();
    await unregisterAllServiceWorkers();

    console.log('[Limpeza] Recarregando página limpa...');
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
        sessionStorage.removeItem('sw_cleaned');
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
              sessionStorage.removeItem('sw_cleaned');
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
        sessionStorage.removeItem('sw_cleaned');
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
