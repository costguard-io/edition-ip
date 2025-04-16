// Import Firebase libraries for Messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker context
firebase.initializeApp({
    apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain: "costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket: "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId: "1:873736687737:web:be444e90d27f23364544a8"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages and attach data payload to the notification
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Received background message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon/favicon.ico',
        data: payload.data || {} // Attach extra data for later use
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Listen for notification clicks to pass data into the app
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received:', event);
    event.notification.close();

    const clickData = event.notification.data;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                // Send a message to the first open client with the click data.
                clientList[0].postMessage({
                    type: 'notification-click',
                    data: clickData
                });
                return clientList[0].focus();
            }
            // If no window is open, open a new one including the data in query params.
            const urlWithData = '/?notificationData=' + encodeURIComponent(JSON.stringify(clickData));
            return clients.openWindow(urlWithData);
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

// Install event with detailed logging
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install event starting.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[ServiceWorker] Caching URLs:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event with cache cleanup logging
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating new service worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.filter(name => name !== CACHE_NAME).map(oldCache => {
                console.log('[ServiceWorker] Deleting old cache:', oldCache);
                return caches.delete(oldCache);
            })
        )).then(() => {
            console.log('[ServiceWorker] Clients claimed.');
            return self.clients.claim();
        })
    );
});

// Fetch event with cache hit/miss logging
self.addEventListener('fetch', event => {
    console.log('[ServiceWorker] Fetch request for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('[ServiceWorker] Cache hit:', event.request.url);
                return response;
            }
            console.log('[ServiceWorker] Cache miss, fetching:', event.request.url);
            return fetch(event.request);
        })
    );
});
