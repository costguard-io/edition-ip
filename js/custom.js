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

function requestNotificationPermission() {
    return Notification.requestPermission();
}

function waitForServiceWorker() {
    return navigator.serviceWorker.ready;
}

function registerPushDevice(jwt) {
    console.log('[registerPushDevice] JWT:', jwt);
    if (!navigator.serviceWorker || !firebase.messaging) {
        console.warn('[registerPushDevice] unsupported');
        return Promise.resolve(null);
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone;
    const allowDev = stateTagApp.env !== 'production';
    if (!isStandalone && !allowDev) {
        console.warn('[registerPushDevice] not PWA');
        return Promise.resolve(null);
    }

    return requestNotificationPermission().then(permission => {
        console.log('[registerPushDevice] permission:', permission);
        if (permission !== 'granted') return null;

        return waitForServiceWorker().then(reg => {
            console.log('[registerPushDevice] SW ready');
            return firebase.messaging().getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: reg
            });
        }).then(token => {
            if (!token) {
                console.warn('[registerPushDevice] no token');
                return null;
            }
            const agent    = navigator.userAgent;
            const platform = /android/i.test(agent) ? 'android'
                : /iphone|ipad|ipod/i.test(agent) ? 'ios'
                    : 'web';
            const result   = { token, platform, agent };
            console.log('[registerPushDevice] success:', result);
            return result;
        }).catch(err => {
            console.error('[registerPushDevice] error:', err);
            return null;
        });
    });
}

function handleNotificationData(data) {
    console.log('Notification payload:', data);
    // your app logic here
}

document.addEventListener('DOMContentLoaded', () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized');
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
            .then(reg => console.log('[SW] registered'))
            .catch(err => console.error('[SW] reg failed', err));

        // listen for SW messages
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data?.type === 'notification-click') {
                handleNotificationData(event.data.data);
            }
            if (event.data?.type === 'sw-log') {
                console.debug('SW log:', event.data.msg, event.data.data);
            }
        });

        // fallback onmessage
        navigator.serviceWorker.onmessage = event => {
            if (event.data?.type === 'notification-click') {
                handleNotificationData(event.data.data);
            }
        };
    }

    // handle URL param
    const params = new URLSearchParams(window.location.search);
    const raw    = params.get('notification');
    if (raw) {
        try {
            handleNotificationData(JSON.parse(decodeURIComponent(raw)));
        } catch (e) {
            console.error('Invalid notification param', e);
        }
    }
});
