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

// Register Service Worker on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (!('serviceWorker' in navigator)) {
        console.warn('[custom] SW unsupported');
        return;
    }

    navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
        .then(reg => {
            console.log('[custom] SW registered, scope:', reg.scope);
            console.log('[custom] controller:', navigator.serviceWorker.controller?.scriptURL);
        })
        .catch(err => {
            console.error('[custom] SW registration failed:', err);
        });
});

// Listen for messages from SW
navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'sw-log') {
        console.debug('[SW]', event.data.msg, event.data.data);
    }
    if (event.data?.type === 'notification-click') {
        handleNotificationData(event.data.data);
    }
});

// Fallback: parse notification hash on initial load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#notification=')) {
        try {
            const data = JSON.parse(decodeURIComponent(hash.split('=')[1]));
            handleNotificationData(data);
        } catch (e) {
            console.error('[custom] Invalid hash payload', e);
        }
    }
});

// Expose push‑device registration
function registerPushDevice(jwt) {
    console.log('[registerPushDevice] JWT:', jwt);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone;
    const allowDev = stateTagApp.env !== 'production';
    if (!isStandalone && !allowDev) {
        console.warn('[registerPushDevice] not running in PWA mode');
        return Promise.resolve(null);
    }

    return Notification.requestPermission()
        .then(permission => {
            console.log('[registerPushDevice] permission:', permission);
            if (permission !== 'granted') return null;
            return navigator.serviceWorker.ready;
        })
        .then(reg => {
            if (!reg) return null;
            return messaging.getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: reg
            });
        })
        .then(token => {
            if (!token) {
                console.warn('[registerPushDevice] no FCM token');
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

window.registerPushDevice = registerPushDevice;
window.handleNotificationData = function(data) {
    console.log('[custom] Notification payload received:', data);
    // ← your app logic here (e.g. router.push or UI update)
};
