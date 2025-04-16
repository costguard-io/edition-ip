// service-worker.js

// Import only Firebase core (no messaging compat)
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');

firebase.initializeApp({
    apiKey:    "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain:"costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket:"costguard.firebasestorage.app",
    messagingSenderId:"873736687737",
    appId:     "1:873736687737:web:be444e90d27f23364544a8"
});

// --- PUSH: catch every incoming payload ---
self.addEventListener('push', event => {
    let payload = {};
    try {
        payload = event.data.json();
    } catch (e) {
        console.error('[SW] push but invalid JSON:', e);
    }

    const title = payload.notification?.title || 'Notification';
    const body  = payload.notification?.body  || '';
    const data  = payload.data || payload;

    const options = {
        body,
        icon: '/favicon/favicon.ico',
        data
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// --- CLICK: deep‑link with JSON in URL hash ---
self.addEventListener('notificationclick', event => {
    event.notification.close();

    const data = event.notification.data || {};
    const url  = '/#notification=' +
        encodeURIComponent(JSON.stringify(data));

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(winList => {
                if (winList.length) {
                    return winList[0].navigate(url).then(w => w.focus());
                }
                return clients.openWindow(url);
            })
    );
});

// --- CACHING: install, activate, fetch ---
const CACHE_NAME = 'costguard-v#BUILD#';  // bump on each deploy
const urlsToCache = [
    '/index.html',
    '/cache.manifest',

    '/favicon/apple-touch-icon.png',
    '/favicon/favicon.ico',
    '/favicon/icon-192.png',
    '/favicon/icon-512.png',
    '/favicon/icon-maskable.png',

    '/css/custom.css',
    '/css/cutestrap.css',

    '/js/app.js',
    '/js/custom.js',
    '/js/sta-api.js',
    '/js/sta-config.js',
    '/js/sta-io.js',
    '/js/sta-nebula.js',
    '/js/sta-socket.js',
    '/js/sta-state.js',
    '/js/stripe.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(
                names
                    .filter(name => name !== CACHE_NAME)
                    .map(old => caches.delete(old))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(resp => resp || fetch(event.request))
    );
});
