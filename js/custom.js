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
    return Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, rej) => setTimeout(() => rej(new Error('SW ready timeout')), timeout))
    ]);
}

const registerPushDevice = function(jwt) {
    console.log('[registerPushDevice] JWT:', jwt);
    return requestNotificationPermission()
        .then(permission => {
            console.log('[registerPushDevice] Permission:', permission);
            if (permission !== 'granted') return null;
            return waitForServiceWorker();
        })
        .then(registration => {
            if (!registration) return null;
            const messaging = firebase.messaging();
            return messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
        })
        .then(token => {
            if (!token) return null;
            const agent = navigator.userAgent;
            const platform = /android/i.test(agent) ? 'android'
                : /iphone|ipad|ipod/i.test(agent) ? 'ios'
                    : 'web';
            const result = { token, platform, agent };
            console.log('[registerPushDevice] Success:', result);
            return result;
        })
        .catch(err => {
            console.error('[registerPushDevice] Error:', err);
            return null;
        });
};

// Init Firebase
document.addEventListener("DOMContentLoaded", () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized");
    }
});

// Register SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
        .then(reg => console.log('[SW] Registered:', reg))
        .catch(err => console.error('[SW] Reg failed:', err));
}

// Listen for SW messages (postMessage)
navigator.serviceWorker.addEventListener('message', event => {
    console.log('navigator.serviceWorker message:', event);
    if (event.data?.type === 'notification-click') {
        console.log('Notification click via postMessage:', event.data.data);
        handleNotificationClick(event.data.data);
    }
});

// Fallback: check URL for notificationData on load
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('notificationData');
    if (raw) {
        try {
            const data = JSON.parse(decodeURIComponent(raw));
            console.log('Notification click via URL:', data);
            handleNotificationClick(data);
        } catch (e) {
            console.error('Failed to parse notificationData:', e);
        }
    }
});

function handleNotificationClick(data) {
    console.log('Handling notification-click:', data);
    // <-- put your routing or command logic here -->
}
