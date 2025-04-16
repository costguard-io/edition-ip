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
        console.warn('[registerPushDevice] unsupported environment');
        return Promise.resolve(null);
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone;
    const allowDev = stateTagApp.env !== 'production';
    if (!isStandalone && !allowDev) {
        console.warn('[registerPushDevice] not PWA mode');
        return Promise.resolve(null);
    }

    return requestNotificationPermission().then(permission => {
        console.log('[registerPushDevice] perm:', permission);
        if (permission !== 'granted') return null;

        return waitForServiceWorker().then(reg => {
            console.log('[registerPushDevice] SW ready:', reg);
            const messaging = firebase.messaging();
            return messaging.getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: reg
            });
        }).then(token => {
            if (!token) {
                console.warn('[registerPushDevice] no token');
                return null;
            }
            const agent = navigator.userAgent;
            const platform = /android/i.test(agent) ? 'android'
                : /iphone|ipad|ipod/i.test(agent) ? 'ios'
                    : 'web';
            const result = { token, platform, agent };
            console.log('[registerPushDevice] success:', result);
            return result;
        }).catch(err => {
            console.error('[registerPushDevice] error', err);
            return null;
        });
    });
}

function handleNotificationData(data) {
    console.log('Notification payload received:', data);
    // <-- your app logic here (e.g. router.push or UI update)
}

document.addEventListener('DOMContentLoaded', () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized');
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-workers.js', { scope:'/' })
            .then(reg => console.log('[SW] registered', reg))
            .catch(err => console.error('[SW] registration failed', err));

        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data?.type === 'notification-click') {
                handleNotificationData(event.data.data);
            }
            if (event.data?.type === 'sw-log') {
                console.debug('SW log:', event.data.msg, event.data.data);
            }
        });
    } else {
        console.warn('[SW] not supported');
    }

    // parse URL param on initial load
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('notification');
    if (raw) {
        try {
            const data = JSON.parse(decodeURIComponent(raw));
            handleNotificationData(data);
        } catch (e) {
            console.error('Invalid notification param', e);
        }
    }
});
