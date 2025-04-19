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

// Background message handler
messaging.onBackgroundMessage(payload => {
  const data = payload.data || {};
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Notification', {
    body,
    icon: icon || '/favicon/icon-192.png',
    data
  });
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  const data = event.notification?.data || {};
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then(windowClients => {
      if (windowClients.length) {
        return windowClients[0].focus().then(client => {
          client.postMessage({type:'notification-click', data});
        });
      }
      const url = '/?data=' + encodeURIComponent(JSON.stringify(data));
      return clients.openWindow(url);
    })
  );
});

// Cache assets on install
const CACHE = 'static-v3.7.27';
const ASSETS = ['/', '/index.html', '/css/custom.css', '/js/app.js', '/manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

// Clean old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

// Serve from cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
