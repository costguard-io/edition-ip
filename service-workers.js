// service-worker.js

// Import Firebase core
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');

firebase.initializeApp({
    apiKey:    "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain:"costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket:"costguard.firebasestorage.app",
    messagingSenderId:"873736687737",
    appId:     "1:873736687737:web:…"
});

// helper to forward logs into the page
function swLog(...args) {
    self.clients.matchAll({ includeUncontrolled: true }).then(clients =>
        clients.forEach(c =>
            c.postMessage({ type: 'sw-log', args })
        )
    );
    // also print in SW console (if it ever appears)
    console.log(...args);
}

// --- Push event: catch every payload ---
self.addEventListener('push', event => {
    let payload = {};
    if (event.data) {
        try { payload = event.data.json() }
        catch(e) { swLog('[SW] push but invalid JSON:', e) }
    }
    swLog('[SW] push received:', payload);

    const title = payload.notification?.title || 'Notification';
    const body  = payload.notification?.body  || 'You have a new message';
    const data  = payload.data || payload;

    const options = { body, icon: '/favicon/favicon.ico', data };

    event.waitUntil(self.registration.showNotification(title, options));
});

// --- Notification click: forward data into app ---
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const clickData = event.notification.data;
    swLog('[SW] notificationclick data:', clickData);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            if (list.length) {
                list[0].postMessage({ type: 'notification-click', data: clickData });
                return list[0].focus();
            }
            const url = '/?notificationData=' + encodeURIComponent(JSON.stringify(clickData));
            return clients.openWindow(url);
        })
    );
});

// --- Caching Logic ---
const CACHE_NAME = 'costguard-v#BUILD#';
const urlsToCache = [ /* your list */ ];

self.addEventListener('install', event => {
    swLog('[SW] install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    swLog('[SW] activate');
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(names
                .filter(n => n !== CACHE_NAME)
                .map(old => caches.delete(old))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // optional: log every fetch
    // swLog('[SW] fetch:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(r => r || fetch(event.request))
    );
});
