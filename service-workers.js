// service-workers.js

// Import Firebase (only the core app, no messaging compat)
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');

// Initialize Firebase in the service worker context
firebase.initializeApp({
    apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain: "costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket: "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId: "1:873736687737:web:be444e90d27f23364544a8"
});

// --- Push Event: catch every incoming payload ---
self.addEventListener('push', event => {
    let payload = {};
    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            console.error('[Service Worker] Push event but payload not JSON', e);
        }
    }
    console.log('[Service Worker] Push received:', payload);

    const title = payload.notification?.title || 'Notification';
    const body  = payload.notification?.body  || 'You have a new message';
    const data  = payload.data || payload;

    const options = {
        body,
        icon: '/favicon/favicon.ico',
        data
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// --- Notification Click: forward data into app ---
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const clickData = event.notification.data;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) {
                clientList[0].postMessage({
                    type: 'notification-click',
                    data: clickData
                });
                return clientList[0].focus();
            }
            const url = '/?notificationData=' + encodeURIComponent(JSON.stringify(clickData));
            return clients.openWindow(url);
        })
    );
});

// --- Caching Logic ---
const CACHE_NAME = 'costguard-v#BUILD#';
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

// Install: cache files
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(
                names.filter(name => name !== CACHE_NAME).map(old => caches.delete(old))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
