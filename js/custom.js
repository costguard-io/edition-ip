// custom.js

const VAPID_KEY = 'BAwmsOG6_r388MZNXTrkXm39s7vK9EMFKA9ev8xKaMjaSfceNKbrOfufSomRABKGF6eoBZrCVIjzwtpWtmbauGM';

const firebaseConfig = {
    apiKey:            "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain:        "costguard.firebaseapp.com",
    projectId:         "costguard",
    storageBucket:     "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId:             "1:873736687737:web:be444e90d27f23364544a8"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('[custom] Firebase initialized');
}

const messaging = firebase.messaging();

// Handle incoming messages from SW
navigator.serviceWorker?.addEventListener('message', event => {
    if (event.data?.type === 'notification-click') {
        handleNotificationData(event.data.data);
    }
    if (event.data?.type === 'sw-log') {
        console.debug('SW log:', event.data.msg, event.data.data);
    }
});

// Parse notification from URL on load
(function handleNotificationFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw    = params.get('notification');
    if (!raw) return;
    try {
        const data = JSON.parse(decodeURIComponent(raw));
        handleNotificationData(data);
    } catch (e) {
        console.error('[custom] Invalid notification param', e);
    }
})();

// Register & ready the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
        .then(reg => console.log('[custom] SW registered:', reg))
        .catch(err => console.error('[custom] SW registration failed:', err));
} else {
    console.warn('[custom] Service Worker unsupported');
}

// Push‑device registration
function registerPushDevice(jwt) {
    console.log('[registerPushDevice] JWT:', jwt);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone;
    const allowDev = stateTagApp.env !== 'production';
    if (!isStandalone && !allowDev) {
        console.warn('[registerPushDevice] Not running in PWA mode');
        return Promise.resolve(null);
    }

    return Notification.requestPermission()
        .then(permission => {
            console.log('[registerPushDevice] permission:', permission);
            if (permission !== 'granted') return null;
            return navigator.serviceWorker.ready; // <-- NEVER destructured
        })
        .then(registration => {
            if (!registration) return null;
            return messaging.getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });
        })
        .then(token => {
            if (!token) {
                console.warn('[registerPushDevice] no FCM token returned');
                return null;
            }
            const ua = navigator.userAgent;
            const platform = /android/i.test(ua) ? 'android'
                : /iphone|ipad|ipod/i.test(ua) ? 'ios'
                    : 'web';
            const result = { token, platform, agent: ua };
            console.log('[registerPushDevice] success:', result);
            return result;
        })
        .catch(err => {
            console.error('[registerPushDevice] error:', err);
            return null;
        });
}

// Expose to your app
window.registerPushDevice   = registerPushDevice;
window.handleNotificationData = function(data) {
    console.log('[custom] Notification payload received:', data);
    // ← your app logic here (router push, UI update, etc.)
};
