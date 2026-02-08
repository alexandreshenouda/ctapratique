// Firebase Cloud Messaging Service Worker
// Ce fichier DOIT rester à la racine du site pour fonctionner.
// Il gère les notifications push en arrière-plan (quand l'app n'est pas au premier plan).

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// La config Firebase est injectée automatiquement par le script de build.
// Fallback : valeurs par défaut (remplacées au build).
const firebaseConfig = self.__FIREBASE_CONFIG || {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Gestion des notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Notification reçue en arrière-plan:', payload);

  const notificationTitle = payload.notification?.title || 'CTA Pratique';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: 'assets/logo.jpg',
    badge: 'assets/logo.jpg',
    data: payload.data,
    tag: payload.messageId || 'default',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Quand l'utilisateur clique sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Ouvre l'app ou la met au premier plan
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si l'app est déjà ouverte, on la met au premier plan
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon on ouvre une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
