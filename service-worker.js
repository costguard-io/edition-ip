importScripts('//www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('//www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain: "costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket: "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId: "1:873736687737:web:be444e90d27f23364544a8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    //console.log('📬 Firebase BG Message:', payload);

    const data = payload.data || {};
    const notification = payload.notification || {};

    const title = notification.title || data.title || 'Notification';
    const body = notification.body || data.body || '';
    const icon = notification.icon || '/favicon/icon-192.png';

    self.registration.showNotification(title, {
        body,
        icon,
        data
    });
});

self.addEventListener('notificationclick', event => {
    const data = event.notification?.data || {};
    console.log('🖱️ Notification clicked:', data);

    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
            const existing = clientsArr.find(c => c.url.includes('/') && 'focus' in c);
            if (existing) {
                existing.postMessage({ type: 'notification-click', data });
                return existing.focus();
            } else {
                const encoded = encodeURIComponent(JSON.stringify(data));
                return clients.openWindow(`/?data=${encoded}`);
            }
        })
    );
});

const CACHE_NAME = 'cg-static-v9.7.54';
const PRECACHE_URLS = [
    '/',
    '/index.html',

    '/splash-screens/apple-splash-750x1334-portrait.jpg',
    '/splash-screens/apple-splash-828x1792-portrait.jpg',
    '/splash-screens/apple-splash-1125x2436-portrait.jpg',
    '/splash-screens/apple-splash-1170x2532-portrait.jpg',
    '/splash-screens/apple-splash-1179x2556-portrait.jpg',
    '/splash-screens/apple-splash-1242x2208-portrait.jpg',
    '/splash-screens/apple-splash-1242x2688-portrait.jpg',
    '/splash-screens/apple-splash-1284x2778-portrait.jpg',
    '/splash-screens/apple-splash-1290x2796-portrait.jpg',

    '/favicon/apple-touch-icon.png',
    '/favicon/favicon.ico',
    '/favicon/icon-192.png',
    '/favicon/icon-512.png',
    '/favicon/icon-maskable.png',

    '/css/cutestrap.css',
    '/css/strapon.css',
    '/css/custom.css',

    '/js/sta-config.js',
    '/js/sta-state.js',
    '/js/sta-socket.js',
    '/js/sta-nebula.js',
    '/js/sta-io.js',
    '/js/sta-api.js',
    '/js/stripe.js',
    '/service-handler.js',
    '/utilities.js',

    '/manifest.json'
];

console.log('🔥 SW loaded: version 9.7.54');

self.addEventListener('install', event => {
    console.log('📦 Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('🚀 Activated');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});


/**
 * Fetch handler for all requests, use this to cache and serve the files from your server or local file system:
 */
/*self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});*/
