// service-handler.js
const SW_FILE = '/service-worker.js';
const VAPID_KEY = 'BAwmsOG6_r388MZNXTrkXm39s7vK9EMFKA9ev8xKaMjaSfceNKbrOfufSomR4A8'; // truncated for brevity

const firebaseConfig = {
  apiKey: "AIzaSyAdxJQfsIspb5sdPeVMQ5Zu_5X3GjDBTYg",
  authDomain: "costguard.firebaseapp.com",
  projectId: "costguard",
  storageBucket: "costguard.firebasestorage.app",
  messagingSenderId: "873736687737",
  appId: "1:873736687737:web:be444e90d27f23364544a8"
};

// Initialize Firebase app and messaging
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle incoming messages in foreground
messaging.onMessage(payload => {
  const data = payload.data || {};
  handleNotificationData(data);
});

// Listen for messages from the service worker (background clicks)
navigator.serviceWorker.addEventListener('message', event => {
  if (event.data?.type === 'notification-click') {
    handleNotificationData(event.data.data);
  }
});

// Notification data handler
window.handleNotificationData = function(data) {
  console.log('Received notification data:', data);
  alert(`Notification Data\nModel: ${data.model}\nID: ${data.id}`);
};

// Register service worker and process URL data on load
window.addEventListener('load', async () => {
  try {
    const reg = await navigator.serviceWorker.register(SW_FILE, {scope: '/'});
    console.log('Service Worker registered:', reg.scope);

    try {
      const fcmToken = await messaging.getToken({
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: reg
      });
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
      } else {
        console.warn('No FCM token retrieved');
      }
    } catch (e) {
      console.error('FCM getToken error:', e);
    }
  } catch (err) {
    console.error('SW registration failed:', err);
  }

  // Cold-start notification data via URL
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('data');
  if (raw) {
    try {
      const data = JSON.parse(decodeURIComponent(raw));
      handleNotificationData(data);
    } catch (e) {
      console.warn('Failed to parse push data from URL:', e);
    }
  }
});
