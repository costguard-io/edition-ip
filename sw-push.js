const VAPID_KEY = 'BAwmsOG6_r388MZNXTrkXm39s7vK9EMFKA9ev8xKaMjaSfceNKbrOfufSomRABKGF6eoBZrCVIjzwtpWtmbauGM';
const firebaseConfig = {
    apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain: "costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket: "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId: "1:873736687737:web:be444e90d27f23364544a8"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const messaging = firebase.messaging();

// React to Service Worker postMessage
navigator.serviceWorker.addEventListener('message', event => {
    const {type, msg, data} = event.data || {};
    if (type === 'sw-log') console.log('[FROM SW]', msg, data);
    if (type === 'notification-click') handleNotificationData(data);
});

// Handle notification hash on initial load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#notification=')) {
        try {
            const data = JSON.parse(decodeURIComponent(hash.split('=')[1]));
            handleNotificationData(data);
        } catch (e) {
            console.error('Invalid hash payload', e);
        }
    }
});

async function registerPushDevice(token) {
    try {
        console.log('[registerPushDevice] JWT:', token);

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('[registerPushDevice] Notification permission not granted');
            return null;
        }

        const reg = await navigator.serviceWorker.ready;
        const fcmToken = await messaging.getToken({
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: reg
        });

        if (!fcmToken) {
            console.warn('[registerPushDevice] No FCM token returned');
            return null;
        }

        const device = {
            token: fcmToken,
            platform: /android/i.test(navigator.userAgent) ? 'android'
                : /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios'
                    : 'web',
            agent: navigator.userAgent
        };

        console.log('[registerPushDevice] device:', device);

        // Send to your backend
        await fetch('/api/device/register', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(device)
        });

        return device;

    } catch (err) {
        console.error('[registerPushDevice] Error:', err);
        return null;
    }
};

window.handleNotificationData = function (data) {
    console.log('✅ Notification data:', data);
};
