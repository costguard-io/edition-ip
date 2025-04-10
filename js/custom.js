


const VAPID_KEY = 'BAwmsOG6_r388MZNXTrkXm39s7vK9EMFKA9ev8xKaMjaSfceNKbrOfufSomRABKGF6eoBZrCVIjzwtpWtmbauGM';

// Use EXACT values from your Firebase Console "Project settings > General > Your apps"
const firebaseConfig = {
    apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain: "costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket: "costguard.firebasestorage.app",
    messagingSenderId: "873736687737",
    appId: "1:873736687737:web:be444e90d27f23364544a8"
};

function requestNotificationPermission() {
    return new Promise((resolve, reject) => {
        Notification.requestPermission(result => {
            resolve(result);
        });
    });
}

function waitForServiceWorker(timeout = 5000) {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.ready.then(resolve).catch(reject);
        setTimeout(() => {
            reject(new Error('Service worker ready timeout'));
        }, timeout);
    });
}

const destroyMode = function() {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let reg of registrations) reg.unregister();
        caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
            location.reload(true);
        });
    });
};

const registerPushDevice = function(jwt) {
    console.log('[registerPushDevice] Starting with JWT:', jwt);
    return new Promise((resolve) => {
        if (!('serviceWorker' in navigator)) {
            console.warn('[registerPushDevice] Service workers not supported.');
            return resolve(null);
        }

        if (!firebase || !firebase.messaging) {
            console.warn('[registerPushDevice] Firebase messaging not available.');
            return resolve(null);
        }

        // Check if running in standalone/PWA mode
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone;

        if (!isStandalone) {
            console.warn('[registerPushDevice] Not running in standalone/PWA mode.');
            return resolve(null);
        }

        requestNotificationPermission().then(function(permission) {
            // 'granted', 'denied', or 'default'
            console.log('[registerPushDevice] Notification permission:', permission);

            if (permission !== 'granted') {
                console.warn('[registerPushDevice] Permission not granted.');
                return resolve(null);
            }

            waitForServiceWorker().then(function(registration) {
                console.log('[registerPushDevice] Service worker is ready:', registration);

                const messaging = firebase.messaging();
                messaging.getToken({
                    vapidKey: VAPID_KEY,
                    serviceWorkerRegistration: registration
                }).then(function(token) {
                    console.log('[registerPushDevice] FCM Token:', token);
                    if (!token) {
                        console.warn('[registerPushDevice] No token returned.');
                        return resolve(null);
                    }
                    const agent = navigator.userAgent;
                    let platform = 'web';
                    if (/android/i.test(agent)) platform = 'android';
                    else if (/iphone|ipad|ipod/i.test(agent)) platform = 'ios';

                    const result = { token, platform, agent };
                    console.log('[registerPushDevice] Success:', result);
                    resolve(result);
                }).catch(function(err) {
                    console.error('[registerPushDevice] getToken failed:', err);
                    resolve(null);
                });
            }).catch(function(err) {
                console.error('[registerPushDevice] Service worker not ready:', err);
                resolve(null);
            });
        }).catch(function(err) {
            console.error('[registerPushDevice] Notification permission request failed:', err);
            resolve(null);
        });
    });
};

// Initialize Firebase if it hasn't been initialized yet
document.addEventListener("DOMContentLoaded", function() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized");
    }
});


// Register the service worker
if ('serviceWorker' in navigator) {
    // Make sure the file name here matches the second file below
    navigator.serviceWorker.register('/service-workers.js', { scope: '/' })
        .then(function(reg) {
            console.log('[Service Worker] Registered successfully:', reg);
        })
        .catch(function(err) {
            console.error('[Service Worker] Registration failed:', err);
        });
} else {
    console.warn('[Service Worker] Not supported in this browser.');
}

