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

function handleNotificationData(data) {
    console.log('[custom] Notification payload:', data);
    // ← your app logic here (router push, UI update…)
}

// Listen for SW logs & clicks
navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'sw-log') {
        console.debug('[SW]', event.data.msg, event.data.data);
    }
    if (event.data?.type === 'notification-click') {
        handleNotificationData(event.data.data);
    }
});

// Parse on-load hash
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

// Register SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
        .then(() => console.log('[custom] SW registered'))
        .catch(err => console.error('[custom] SW reg failed', err));
}

// Push registration
function registerPushDevice(jwt) {
    console.log('[registerPushDevice] JWT:', jwt);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone;
    const allowDev = stateTagApp.env !== 'production';
    if (!isStandalone && !allowDev) {
        console.warn('[registerPushDevice] not PWA');
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
