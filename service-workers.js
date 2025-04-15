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

console.log('Service Worker Loaded');

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon/favicon.ico'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
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

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.filter(name => name !== CACHE_NAME).map(oldCache => {
                return caches.delete(oldCache);
            })
        )).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache and handle errors
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return the cached response if available
            if (response) {
                return response;
            }
            // If not in cache, fetch the resource from the network.
            return fetch(event.request)
                .catch(error => {
                    console.error('[ServiceWorker] Fetch failed for:', event.request.url, error);
                    // Optionally, if the request is a navigation, return a fallback:
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});
