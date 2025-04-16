console.log('🔥 Hello from the Service Worker');

self.addEventListener('install', event => {
    console.log('📦 Installed');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('🚀 Activated');
    self.clients.claim();
});
