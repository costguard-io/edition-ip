// custom.js

// Make sure your HTML loads these *before* custom.js:
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"></script>

const VAPID_KEY = 'BAwmsOG6_r388MZNXTrkXm39s7vK9EMFKA9ev8xKaMjaSfceNKbrOfufSomRABKGF6eoBZrCVIjzwtpWtmbauGM';
const firebaseConfig = {
    apiKey:    "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain:"costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket:"costguard.firebasestorage.app",
    messagingSenderId:"873736687737",
    appId:     "1:873736687737:web:be444e90d27f23364544a8"
};

// Initialize Firebase & register Service Worker + Push
document.addEventListener('DOMContentLoaded', () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('[App] Firebase initialized');
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
            .then(reg => {
                console.log('[App] SW registered:', reg);
                return reg;
            })
            .then(reg => registerPushDevice(reg))
            .catch(err => console.error('[App] SW reg failed:', err));
    } else {
        console.warn('[App] Service workers not supported.');
    }

    // Deep‑link fallback: parse #notification=... on load
    const m = window.location.hash.match(/notification=(.*)$/);
    if (m) {
        try {
            const payload = JSON.parse(decodeURIComponent(m[1]));
            console.log('[App] Notification via deep‑link:', payload);
            handleNotificationClick(payload);
        } catch (e) {
            console.error('[App] Failed to parse notificationData:', e);
        }
    }
});

// Request permission & get FCM token
function registerPushDevice(registration) {
    return Notification.requestPermission()
        .then(permission => {
            console.log('[App] Notification permission:', permission);
            if (permission !== 'granted') throw new Error('Permission denied');
            return firebase.messaging().getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });
        })
        .then(token => {
            console.log('[App] FCM token:', token);
            // send token + platform to your backend here if needed
            return token;
        })
        .catch(err => console.error('[App] Push registration failed:', err));
}

// Your handler for when a notification is clicked
function handleNotificationClick(data) {
    console.log('[App] handleNotificationClick:', data);
    // e.g. router.push(`/invoices/${data.invoiceId}`)
}
