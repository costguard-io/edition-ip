const SW_VERSION = '#BUILD#';
const SW_FILE = `/service-worker.js?v=${SW_VERSION}`;
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

window.registerPushDevice = async function(token) {
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

navigator.serviceWorker.addEventListener('message', event => {
    const { type, data } = event.data || {};
    if (type === 'sw-log') console.log('[FROM SW]', data);
    if (type === 'notification-click') handleNotificationData(data);
});

window.handleNotificationData = function (data) {
    console.log('✅ Notification data:', data);
};

window.addEventListener('load', async () => {
    try {
        const reg = await navigator.serviceWorker.register(SW_FILE, { scope: '/' });
        console.log('✅ SW registered:', reg.scope);

        if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });

        reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            newSW?.addEventListener('statechange', () => {
                if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('📦 New SW installed, pending activation');
                }
            });
        });

        const trySkip = () => reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
        window.addEventListener('beforeunload', trySkip);
        window.addEventListener('pagehide', trySkip);

        const params = new URLSearchParams(window.location.search);
        const raw = params.get('data');
        if (raw) {
            try {
                const data = JSON.parse(decodeURIComponent(raw));
                handleNotificationData(data);
            } catch (e) {
                console.warn('Invalid push data in query param', e);
            }
        }
    } catch (err) {
        console.error('❌ SW registration failed:', err);
    }
});
