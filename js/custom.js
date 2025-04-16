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

// Immediately register SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(reg => {
        console.log('[SW] Registered:', reg.scope);
    });
}

// Handle messages from SW
navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'notification-click') {
        handleNotificationData(event.data.data);
    }
});

// Initial page-load notification handling
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

function registerPushDevice(jwt) {
    return Notification.requestPermission().then(permission => {
        if (permission !== 'granted') return null;
        return navigator.serviceWorker.ready;
    }).then(reg => {
        return messaging.getToken({
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: reg
        });
    }).then(token => {
        if (!token) return null;
        return {
            token,
            platform: /android/i.test(navigator.userAgent) ? 'android'
                : /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios'
                    : 'web',
            agent: navigator.userAgent
        };
    }).catch(console.error);
}

window.registerPushDevice = registerPushDevice;

window.handleNotificationData = function(data) {
    console.log('✅ Notification data:', data);
};
