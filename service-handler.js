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

/**
 * START SETUP
 */
// Register device with token
const registerPushDevice = async function (token) {
    try {
        console.log('[registerPushDevice] JWT:', token);
        console.log('🔍 Before requestPermission, current:', Notification.permission);

        const permission = await Notification.requestPermission();
        console.log('✅ requestPermission resolved as:', permission);
        if (permission !== 'granted') return null;

        const reg = await navigator.serviceWorker.ready;
        const fcmToken = await messaging.getToken({
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: reg
        });

        if (!fcmToken) return null;

        const device = {
            token: fcmToken,
            platform: /android/i.test(navigator.userAgent) ? 'android'
                : /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios'
                    : 'web',
            agent: navigator.userAgent
        };

        console.log('[registerPushDevice] device:', device);

        let url = stateTagApp.api.concat('/')
            .concat(endPoints.member.device);

        await fetch(url, {
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

// Register service worker
window.addEventListener('load', async () => {
    console.log('🧠 window.load fired');

    try {
        const reg = await navigator.serviceWorker.register(SW_FILE, {scope: '/'});
        console.log('✅ SW registered:', reg.scope);

        if (reg.waiting) reg.waiting.postMessage({type: 'SKIP_WAITING'});

        reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            newSW?.addEventListener('statechange', () => {
                if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('📦 New SW installed, reloading...');
                    newSW.postMessage({type: 'SKIP_WAITING'});
                    window.location.reload();
                }
            });
        });

        const trySkip = () => reg.waiting?.postMessage({type: 'SKIP_WAITING'});
        window.addEventListener('beforeunload', trySkip);
        window.addEventListener('pagehide', trySkip);

        // Handle ?data= payload
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('data');
        if (raw) {
            try {
                const data = JSON.parse(decodeURIComponent(raw));
                handleNotificationData(data);
            } catch (e) {
                console.warn('❌ Failed to parse push data:', e);
            }
        }
    } catch (err) {
        console.error('❌ SW registration failed:', err);
    }
});
/**
 * END SETUP
 */

/**
 * START HANDLING
 * Handle push notification click event (from Service Worker)
 * Background: toaster -> click -> handle data
 * Foreground: toaster & handle data (click is not relevant)
 */

// Foreground push (no notification toast here, handled by SW)
messaging.onMessage(payload => {
    console.log('📥 Push message received:', payload);
    if(payload.data){
        handleNotificationData(payload.data);
    }
});

// Message from Service Worker (background click)
navigator.serviceWorker.addEventListener('message', event => {
    console.log('📥 Backgrond push received:', event);

    if(event.data?.data){
        handleNotificationData(event.data.data);
    }
});

// Shared handler
window.handleNotificationData = function (data) {
    stateTagApp.$write('notification', data);
};
