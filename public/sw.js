
const CACHE_NAME = 'contable-boliviano-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-facturas') {
    event.waitUntil(syncFacturas());
  }
});

async function syncFacturas() {
  const pendingInvoices = JSON.parse(localStorage.getItem('pending-sync-facturas') || '[]');
  
  for (const invoice of pendingInvoices) {
    try {
      // Aquí iría la lógica de sincronización con SIAT
      console.log('Sincronizando factura:', invoice.numero);
    } catch (error) {
      console.error('Error al sincronizar factura:', error);
    }
  }
}
