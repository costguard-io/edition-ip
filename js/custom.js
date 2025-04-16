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

// Init Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('[custom] Firebase initialized');
}
const messaging = firebase.messaging();

// Debug: log controller & registration scope
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
        .then(reg => {
            console.log('[custom] SW registered, scope:', reg.scope);
            console.log('[custom] controller (should be non-null after reload):', navigator.serviceWorker.controller);
        })
        .catch(err => console.error('[custom] SW registration failed', err));
}

// Global reload handler (from SW activate)
navigator.serviceWorker?.addEventListener('message', event => {
    if (event.data?.type === 'reload-window') {
        console.log('[custom] reload-window message received — reloading to get SW control');
        window.location.reload();
    }
});

// SW logs & notification-click
navigator.serviceWorker?.addEventListener('message', event => {
    if (event.data?.type === 'sw-log') {
        console.debug('[SW]', event.data.msg, event.data.data);
    }
    if (event.data?.type === 'notification-click') {
        handleNotificationData(event.data.data);
    }
});

// Hash‑based fallback on load
(function handleHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#notification=')) {
        try {
            const data = JSON.parse(decodeURIComponent(hash.split('=')[1]));
            handleNotificationData(data);
        } catch (e) {
            console.error('[custom] Invalid hash payload', e);
        }
    }
})();

// requestPermission & getToken
function registerPushDevice(jwt) {
    console.log('[registerPushDevice] JWT:', jwt);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone;
    const allowDev = stateTagApp.env !== 'production';
    if (!isStandalone && !allowDev) {
        console.warn('[registerPushDevice] not PWA mode');
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
            return messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
        })
        .then(token => {
            if (!token) return null;
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
    // ← your app logic here
};
