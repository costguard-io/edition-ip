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

const BUILD = '1.3.23';
const CACHE_NAME = 'costguard-cache-v' + BUILD;

const urlsToCache = [
    '/',
    '/index.html',
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
    '/js/stripe.js',
    '/favicon/favicon.ico',
    '/favicon/icon-192.png',
    '/favicon/icon-512.png',
    '/favicon/apple-touch-icon.png',
    '/favicon/icon-maskable.png'
];

function swLog(msg, data = null) {
    console.log(`[SW v${BUILD}]`, msg, data);
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
        wins.forEach(w => w.postMessage({ type: 'sw-log', msg, data }));
    });
}

self.addEventListener('install', event => {
    swLog(`Installing SW v${BUILD}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    swLog(`Activating SW v${BUILD}`);
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(resp => {
            return resp || fetch(event.request);
        })
    );
});

self.addEventListener('push', event => {
    let payload = {};
    try {
        payload = event.data?.json() ?? {};
    } catch (e) {
        swLog('Push JSON parse error', e);
    }

    swLog('Push received', payload);

    const title = payload.notification?.title || 'Notification';
    const options = {
        body: payload.notification?.body || '',
        icon: '/favicon/favicon.ico',
        data: payload.data || payload
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const data = event.notification.data || {};
    swLog('Notification click', data);

    const url = '/#notification=' + encodeURIComponent(JSON.stringify(data));
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
            if (wins.length > 0) {
                wins[0].postMessage({ type: 'notification-click', data });
                wins[0].focus();
                return wins[0].navigate(url);
            }
            return clients.openWindow(url);
        })
    );
});
