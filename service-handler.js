const SW_FILE = '/service-worker.js';
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

// Register device with token
window.registerPushDevice = async function (token) {
    try {
        console.log('[registerPushDevice] JWT:', token);

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return null;

        const reg = await navigator.serviceWorker.ready;
        const fcmToken = await messaging.getToken({
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: reg
        });

        if (!fcmToken) return null;

        const device = {
            token: fcmToken,
            platform: /android/i.test(navigator.userAgent)
                ? 'android'
                : /iphone|ipad|ipod/i.test(navigator.userAgent)
                    ? 'ios'
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

// Foreground push
messaging.onMessage(payload => {
    console.log('📥 Foreground push received:', payload);
    const data = payload.data || {};
    handleNotificationData(data);
});

// Message from SW (background click)
navigator.serviceWorker.addEventListener('message', event => {
    const { type, data } = event.data || {};
    if (type === 'sw-log') console.log('[FROM SW]', data);
    if (type === 'notification-click') {
        console.log('✅ Notification click received in main thread');
        handleNotificationData(data);
    }
});

// Shared handler
window.handleNotificationData = function (data) {
    console.log('✅ handleNotificationData triggered with:', data);
    setTimeout(() => {
        alert(`handleNotificationData\nModel: ${data.model}\nID: ${data.id}`);
        alert(`STA NameSpace: ${stateTagApp.namespace}`);
        console.log(data);
        // Route or fetch logic can go here
    }, 300);
};

// Register service worker
window.addEventListener('load', async () => {
    console.log('🧠 window.load fired');

    try {
        const reg = await navigator.serviceWorker.register(SW_FILE, { scope: '/' });
        console.log('✅ SW registered:', reg.scope);

        reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            newSW?.addEventListener('statechange', () => {
                if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('📦 New SW installed and ready. Reload manually if needed.');
                    // Don't reload automatically
                    // Consider notifying user
                }
            });
        });

        // Handle ?data= payload (notification click when app is opened)
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('data');
        if (raw) {
            try {
                const data = JSON.parse(decodeURIComponent(raw));
                console.log('🔗 URL-based push data:', data);
                handleNotificationData(data);
            } catch (e) {
                console.warn('❌ Failed to parse push data:', e);
            }
        }
    } catch (err) {
        console.error('❌ SW registration failed:', err);
    }
});
