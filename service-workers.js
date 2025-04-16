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

const BUILD = '1.3.20'; // this gets replaced during build

// Optional: postMessage helper if you want to forward logs to the client
function swLog(msg, data) {
    clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(wins => wins.forEach(w => w.postMessage({ type: 'sw-log', msg, data })));
    console.log(`[SW v${BUILD}] ${msg}`, data ?? '');
}

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

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(wins => {
                const url = '/#notification=' + encodeURIComponent(JSON.stringify(data));
                if (wins.length) {
                    wins[0].postMessage({ type: 'notification-click', data });
                    wins[0].focus();
                    return wins[0].navigate(url);
                }
                return clients.openWindow(url);
            })
    );
});

self.addEventListener('install', event => {
    swLog(`Installing SW v${BUILD}`);
    event.waitUntil(
        caches.open('costguard-v' + BUILD).then(cache => cache.addAll([
            '/index.html',
            '/js/custom.js'
        ])).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    swLog(`Activating SW v${BUILD}`);
    event.waitUntil(self.clients.claim());
});
