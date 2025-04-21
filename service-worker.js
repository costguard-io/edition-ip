importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain: "costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket: "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId: "1:873736687737:web:be444e90d27f23364544a8"
});

const messaging = firebase.messaging();

// ——— Force every incoming push to show a native notification ———
self.addEventListener('push', event => {
    event.waitUntil((async () => {
        const payload = event.data?.json() || {};
        const { title, body, icon } = payload.notification || {};
        const data = payload.data || {};

        await self.registration.showNotification(
            title  || 'Notification',
            {
                body,
                icon: icon || '//favicon.costguard.io/icon-192.png',
                data
            }
        );
    })());
});

messaging.onBackgroundMessage(payload => {
    console.log('📬 Firebase BG Message:', payload);

    const { title, body, icon } = payload.notification || {};
    const data = payload.data || {};

    self.registration.showNotification(title || 'Notification', {
        body,
        icon: icon || '//favicon.costguard.io/icon-192.png',
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

const CACHE_NAME = 'cg-static-v7.8.27';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/custom.css',
    '/js/app.js',
    '/js/sta-api.js',
    '/js/sta-config.js',
    '/js/sta-io.js',
    '/js/sta-nebula.js',
    '/js/sta-socket.js',
    '/js/sta-state.js',
    '/js/stripe.js',
    '//favicon.costguard.io/favicon.ico',
    '//favicon.costguard.io/icon-192.png',
    '//favicon.costguard.io/icon-512.png',
    '/manifest.json'
];

console.log('🔥 SW loaded: version 7.8.27');

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

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});

self.addEventListener('message', event => {
    if (event.data?.type === 'SKIP_WAITING') {
        console.log('⏩ Skipping waiting');
        self.skipWaiting();
    }
});
