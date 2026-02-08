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
 * Enregistre le token FCM dans Firestore pour pouvoir envoyer
 * des notifications à tous les utilisateurs depuis le script.
 */
async function saveTokenToFirestore(token: string): Promise<void> {
  try {
    const projectId = FIREBASE_CONFIG.projectId;
    const apiKey = FIREBASE_CONFIG.apiKey;

    // Créer un hash court du token pour l'utiliser comme ID de document
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(token)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);

    // Enregistrer le token dans Firestore via l'API REST (pas besoin du SDK Firestore)
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/fcm_tokens/${tokenHash}?key=${apiKey}`;

    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          token: { stringValue: token },
          createdAt: { stringValue: new Date().toISOString() },
          userAgent: { stringValue: navigator.userAgent },
        },
      }),
    });

    console.log('[Notifications] Token enregistré dans Firestore.');
  } catch (err) {
    // Non bloquant : les notifications fonctionnent même si l'enregistrement échoue
    console.warn('[Notifications] Impossible d\'enregistrer le token dans Firestore:', err);
  }
}

/**
 * Demande la permission de notification et récupère le token FCM.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') return null;

    if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
      console.warn('[Notifications] Firebase non configuré.');
      return null;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[Notifications] Permission refusée.');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('[Notifications] ✅ Notifications activées.');
      // Sauvegarder automatiquement le token dans Firestore
      await saveTokenToFirestore(token);
      return token;
    } else {
      console.warn('[Notifications] Aucun token obtenu.');
      return null;
    }
  } catch (error: any) {
    console.error('[Notifications] Erreur :', error?.message || error);
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
      const title = payload.notification?.title || 'CTA Pratique';
      const body = payload.notification?.body || '';

      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: 'assets/logo.jpg' });
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
