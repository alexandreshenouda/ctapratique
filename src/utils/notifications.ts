import { Platform, Alert } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { FIREBASE_CONFIG, VAPID_KEY } from '../config/firebase.config';

let messagingInstance: Messaging | null = null;

/**
 * Initialise Firebase et le service de messaging.
 * Ne fait rien si on n'est pas sur le web ou si le navigateur ne supporte pas les notifications.
 */
async function getMessagingInstance(): Promise<Messaging | null> {
  if (Platform.OS !== 'web') {
    console.log('[Notifications] Plateforme non-web, notifications Firebase ignorées.');
    return null;
  }

  if (messagingInstance) {
    return messagingInstance;
  }

  // Vérifier que le navigateur supporte FCM
  const supported = await isSupported();
  if (!supported) {
    console.warn('[Notifications] Ce navigateur ne supporte pas Firebase Messaging.');
    return null;
  }

  // Initialiser Firebase (une seule fois)
  const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
  messagingInstance = getMessaging(app);
  return messagingInstance;
}

/**
 * Demande la permission de notification et récupère le token FCM.
 * Retourne le token si succès, null sinon.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') return null;

    // Vérifier que la config Firebase est renseignée
    if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
      console.warn('[Notifications] Firebase non configuré. Modifiez src/config/firebase.config.ts');
      return null;
    }

    // En développement local, le push service peut refuser les souscriptions.
    // On affiche un avertissement au lieu de planter.
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      console.info('[Notifications] Mode local détecté — les notifications push peuvent ne pas fonctionner sur localhost. Elles fonctionneront une fois déployé en HTTPS.');
    }

    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    // Demander la permission au navigateur
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[Notifications] Permission refusée par l\'utilisateur.');
      return null;
    }

    // Enregistrer le service worker et attendre qu'il soit actif
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('[Notifications] Service Worker enregistré:', registration.scope);

    // Attendre que le service worker soit complètement activé
    // (nécessaire pour que PushManager.subscribe fonctionne)
    if (!registration.active) {
      await new Promise<void>((resolve) => {
        const sw = registration.installing || registration.waiting;
        if (!sw) {
          resolve();
          return;
        }
        sw.addEventListener('statechange', () => {
          if (sw.state === 'activated') {
            resolve();
          }
        });
        // Si déjà activé entre-temps
        if (sw.state === 'activated') {
          resolve();
        }
      });
      console.log('[Notifications] Service Worker activé.');
    }

    // Obtenir le token FCM
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('[Notifications] Token FCM obtenu:');
      console.log(token);
      // -------------------------------------------------------
      // IMPORTANT : ce token identifie cet utilisateur/navigateur.
      // Copiez-le depuis la console du navigateur (F12) pour
      // envoyer des notifications de test depuis Firebase Console.
      // -------------------------------------------------------
      return token;
    } else {
      console.warn('[Notifications] Aucun token FCM obtenu.');
      return null;
    }
  } catch (error: any) {
    // "push service error" est courant sur localhost — pas une vraie erreur en production
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost && error?.message?.includes('push service')) {
      console.warn('[Notifications] Push service indisponible sur localhost — normal en développement. Les notifications fonctionneront une fois déployé en HTTPS.');
    } else {
      console.error('[Notifications] Erreur lors de la demande de permission:', error);
    }
    return null;
  }
}

/**
 * Écoute les notifications reçues quand l'app est au premier plan.
 * Affiche une alerte avec le contenu de la notification.
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

      // Afficher via l'API native Notification du navigateur
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
 * Initialise les notifications : demande la permission et écoute les messages.
 * À appeler une seule fois au démarrage de l'app.
 */
export async function initNotifications(): Promise<void> {
  const token = await requestNotificationPermission();
  if (token) {
    listenForForegroundMessages();
  }
}
