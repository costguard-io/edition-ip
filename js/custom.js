// /js/custom.js

// 1) Your config
var VAPID_KEY = 'BAwmsOG6_r388MZNXTrkXm39s7vK9EMFKA9ev8xKaMjaSfceNKbrOfufSomRABKGF6eoBZrCVIjzwtpWtmbauGM';
var firebaseConfig = {
    apiKey:    "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
    authDomain:"costguard.firebaseapp.com",
    projectId: "costguard",
    storageBucket:"costguard.firebasestorage.app",
    messagingSenderId:"873736687737",
    appId:     "1:873736687737:web:be444e90d27f23364544a8"
};

// 2) Initialize Firebase on load
window.onload = function() {
    firebase.initializeApp(firebaseConfig);
    alert('🔔 Firebase initialized');

    // 3) Register your exact service‑workers.js
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service‑workers.js', { scope: '/' })
            .then(function(registration) {
                alert('🔔 SW registered');
                console.log('SW registration:', registration);

                // 4) Hook messaging to that SW
                var messaging = firebase.messaging();
                messaging.useServiceWorker(registration);

                // 5) Ask for Notification permission
                return Notification.requestPermission().then(function(permission) {
                    alert('🔔 Notification permission: ' + permission);
                    if (permission !== 'granted') {
                        throw 'Permission not granted';
                    }
                    // 6) Get FCM token
                    return messaging.getToken({ vapidKey: VAPID_KEY });
                });
            })
            .then(function(token) {
                alert('🔔 FCM token: ' + token);
                console.log('FCM token:', token);
                // TODO: send this token to your backend
            })
            .catch(function(err) {
                alert('❌ Push setup failed: ' + err);
                console.error('Push setup failed:', err);
            });
    } else {
        alert('⚠️ Service Workers not supported');
    }

    // 7) Deep‑link fallback: parse #notification=… on load
    var hash = window.location.hash;
    if (hash.indexOf('notification=') !== -1) {
        var raw = decodeURIComponent(hash.split('notification=')[1]);
        try {
            var data = JSON.parse(raw);
            alert('🔔 Deep‑link data: ' + JSON.stringify(data));
            console.log('Deep‑link payload:', data);
            // handleNotificationClick(data);
        } catch (e) {
            alert('❌ Invalid notification payload');
            console.error('Invalid payload:', e);
        }
    }
};
