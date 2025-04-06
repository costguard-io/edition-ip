// Import Firebase libraries for Messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker context
firebase.initializeApp({
    apiKey: "AIzaSyA10RmmogaAHz9JWXiwivq-y5dSywJ9ik",
    authDomain: "costguard-c2f20.firebaseapp.com",
    projectId: "costguard-c2f20",
    storageBucket: "costguard-c2f20.firebasestorage.app",
    messagingSenderId: "83067432426",
    appId: "1:83067432426:web:77fb336ce85c8363f69693"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Received background message:', payload);
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
