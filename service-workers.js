// Import Firebase core
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');

firebase.initializeApp({
    apiKey:    "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain:"costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket:"costguard.firebasestorage.app",
    messagingSenderId:"873736687737",
    appId:     "1:873736687737:web:be444e90d27f23364544a8"
});

// Helper: forward logs into your page
function swLog(msg, data) {
    // send to page
    clients.matchAll({ includeUncontrolled: true }).then(arr =>
        arr.forEach(c => c.postMessage({ type:'sw-log', msg, data }))
    );
    // also SW console
    console.log('[SW]', msg, data);
}

// --- PUSH event ---
self.addEventListener('push', event => {
    let payload = {};
    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            swLog('push: invalid JSON', event.data.text());
        }
    }
    swLog('Push received', payload);

    const title   = payload.notification?.title || 'Notification';
    const options = {
        body: payload.notification?.body || '',
        icon: '/favicon/favicon.ico',
        data: payload.data || payload
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// --- CLICK event (deep‑link) ---
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const data = event.notification.data || {};
    swLog('Notification click', data);

    const url = '/#notification=' + encodeURIComponent(JSON.stringify(data));

    event.waitUntil(
        clients.matchAll({ type:'window', includeUncontrolled:true })
            .then(wins => {
                if (wins.length) {
                    return wins[0].navigate(url).then(w => w.focus());
                }
                return clients.openWindow(url);
            })
    );
});

// --- CACHING ---
const CACHE_NAME = 'costguard-v#BUILD#'; // bump on deploy
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
    swLog('install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(c => c.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    swLog('activate');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(old => caches.delete(old))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(r => r || fetch(event.request))
    );
});
