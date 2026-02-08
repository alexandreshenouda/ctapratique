import { Platform } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { FIREBASE_CONFIG, VAPID_KEY } from '../config/firebase.config';

let messagingInstance: Messaging | null = null;

/**
 * Initialise Firebase et le service de messaging.
 */
async function getMessagingInstance(): Promise<Messaging | null> {
  if (Platform.OS !== 'web') return null;

  if (messagingInstance) return messagingInstance;

  const supported = await isSupported();
  if (!supported) {
    console.warn('[Notifications] Ce navigateur ne supporte pas Firebase Messaging.');
    return null;
  }

  const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
  messagingInstance = getMessaging(app);
  return messagingInstance;
}

/**
 * Demande la permission de notification et récupère le token FCM.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') return null;

    if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
      console.warn('[Notifications] Firebase non configuré. Modifiez src/config/firebase.config.ts');
      return null;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    // Demander la permission au navigateur
    const permission = await Notification.requestPermission();
    console.log('[Notifications] Permission:', permission);
    if (permission !== 'granted') {
      console.log('[Notifications] Permission refusée.');
      return null;
    }

    // Enregistrer le service worker manuellement
    console.log('[Notifications] Enregistrement du Service Worker...');
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // Attendre que le SW soit complètement actif
    await navigator.serviceWorker.ready;
    console.log('[Notifications] Service Worker prêt. État:', registration.active?.state);

    // Vérifier que le push manager est disponible
    console.log('[Notifications] PushManager disponible:', !!registration.pushManager);

    // Tester le push subscription directement pour un meilleur diagnostic
    console.log('[Notifications] VAPID_KEY (premiers 20 chars):', VAPID_KEY.substring(0, 20) + '...');
    console.log('[Notifications] messagingSenderId:', FIREBASE_CONFIG.messagingSenderId);

    // Obtenir le token FCM
    console.log('[Notifications] Demande du token FCM...');
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('[Notifications] ✅ Token FCM obtenu:');
      console.log(token);
      return token;
    } else {
      console.warn('[Notifications] Aucun token FCM obtenu.');
      return null;
    }
  } catch (error: any) {
    console.error('[Notifications] ❌ Erreur:', error?.message || error);
    console.error('[Notifications] Type:', error?.name);
    console.error('[Notifications] Stack:', error?.stack);
    return null;
  }
}

/**
 * Écoute les notifications reçues quand l'app est au premier plan.
 */
export function listenForForegroundMessages(): void {
  if (Platform.OS !== 'web') return;
  if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') return;

  getMessagingInstance().then((messaging) => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('[Notifications] Message reçu au premier plan:', payload);

      const title = payload.notification?.title || 'CTA Pratique';
      const body = payload.notification?.body || '';

      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: 'assets/logo.jpg',
        });
      }
    });
  });
}

/**
 * Initialise les notifications au démarrage.
 */
export async function initNotifications(): Promise<void> {
  const token = await requestNotificationPermission();
  if (token) {
    listenForForegroundMessages();
  }
}
