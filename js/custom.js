// custom.js

const VAPID_KEY = 'BAwmsOG6_r388MZNXTrkXm39s7vK9EMFKA9ev8xKaMjaSfceNKbrOfufSomRABKGF6eoBZrCVIjzwtpWtmbauGM';

const firebaseConfig = {
    apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain: "costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket: "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId: "1:873736687737:web:be444e90d27f23364544a8"
};

function requestNotificationPermission() {
    return Notification.requestPermission();
}

function waitForServiceWorker(timeout = 5000) {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.ready.then(resolve).catch(reject);
        setTimeout(() => reject(new Error('SW ready timeout')), timeout);
    });
}

function registerPushDevice(jwt) {
    console.log('[registerPushDevice] JWT:', jwt);
    if (!navigator.serviceWorker || !firebase?.messaging) {
        console.warn('[registerPushDevice] SW or messaging unsupported.');
        return Promise.resolve(null);
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone;
    const allowNonStandalone = stateTagApp.env !== 'production';
    if (!isStandalone && !allowNonStandalone) {
        console.warn('[registerPushDevice] Not in PWA mode.');
        return Promise.resolve(null);
    }

    return requestNotificationPermission().then(permission => {
        console.log('[registerPushDevice] Permission:', permission);
        if (permission !== 'granted') return null;

        return waitForServiceWorker().then(registration => {
            console.log('[registerPushDevice] SW ready:', registration);
            const messaging = firebase.messaging();
            return messaging.getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });
        }).then(token => {
            if (!token) {
                console.warn('[registerPushDevice] No FCM token');
                return null;
            }
            const agent = navigator.userAgent;
            const platform = /android/i.test(agent) ? 'android'
                : /iphone|ipad|ipod/i.test(agent) ? 'ios'
                    : 'web';
            const result = { token, platform, agent };
            console.log('[registerPushDevice] Success:', result);
            return result;
        }).catch(err => {
            console.error('[registerPushDevice] Error:', err);
            return null;
        });
    });
}

// Init Firebase + SW registration
document.addEventListener("DOMContentLoaded", () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized");
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
            .then(reg => console.log('[Service Worker] Registered:', reg))
            .catch(err => console.error('[Service Worker] Reg failed:', err));

        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data?.type === 'notification-click') {
                console.log('Notification click data:', event.data.data);
                // …handle click payload in your app…
            }
            if (event.data?.type === 'sw-log') {
                console.debug('SW log:', event.data.msg, event.data.data);
            }
        });
    } else {
        console.warn('[Service Worker] Not supported');
    }
});
