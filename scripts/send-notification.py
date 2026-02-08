#!/usr/bin/env python3
"""
Envoyer des notifications push aux utilisateurs de CTA Pratique via Firebase Cloud Messaging.

Usage:
  python3 send-notification.py                  → Envoyer une notification à tous les abonnés
  python3 send-notification.py --subscribe TOKEN → Abonner un token au topic "all"
  python3 send-notification.py --token TOKEN     → Envoyer à un appareil spécifique (test)

Prérequis (une seule fois):
  pip3 install google-auth requests

Configuration:
  Placez votre fichier service-account.json dans le même dossier que ce script.
  (Firebase Console > Project Settings > Service accounts > Generate new private key)
"""

import os
import sys
import json

try:
    import requests
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
except ImportError:
    print("❌ Dépendances manquantes. Installez-les avec :")
    print("   pip3 install google-auth requests")
    sys.exit(1)

# --- Configuration ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.path.join(SCRIPT_DIR, 'service-account.json')
PROJECT_ID = 'ctapratique-f302d'
TOPIC = 'all'

FCM_SEND_URL = f'https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send'
IID_SUBSCRIBE_URL = 'https://iid.googleapis.com/iid/v1:batchAdd'
SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']


def get_access_token():
    """Obtient un token OAuth2 à partir du fichier service account."""
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"❌ Fichier introuvable : {SERVICE_ACCOUNT_FILE}")
        print()
        print("Pour l'obtenir :")
        print("  1. Allez sur https://console.firebase.google.com/")
        print("  2. Project Settings (⚙) > Service accounts")
        print("  3. Cliquez 'Generate new private key'")
        print(f"  4. Enregistrez le fichier sous : {SERVICE_ACCOUNT_FILE}")
        sys.exit(1)

    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    credentials.refresh(Request())
    return credentials.token


def send_notification(title, body, token=None):
    """Envoie une notification via FCM v1 API."""
    access_token = get_access_token()
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }

    message = {
        'notification': {
            'title': title,
            'body': body,
        },
    }

    if token:
        message['token'] = token
        print(f"\n📱 Envoi au token : {token[:20]}...")
    else:
        message['topic'] = TOPIC
        print(f"\n📢 Envoi au topic : {TOPIC}")

    payload = {'message': message}
    response = requests.post(FCM_SEND_URL, headers=headers, json=payload)

    if response.status_code == 200:
        print("✅ Notification envoyée avec succès !")
        result = response.json()
        print(f"   Message ID : {result.get('name', 'N/A')}")
    else:
        print(f"❌ Erreur {response.status_code} :")
        print(f"   {response.text}")

    return response


def subscribe_token(fcm_token):
    """Abonne un token FCM au topic 'all'."""
    access_token = get_access_token()
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
        'access_token_auth': 'true',
    }
    payload = {
        'to': f'/topics/{TOPIC}',
        'registration_tokens': [fcm_token],
    }

    response = requests.post(IID_SUBSCRIBE_URL, headers=headers, json=payload)

    if response.status_code == 200:
        result = response.json()
        errors = result.get('results', [])
        if errors and errors[0] == {}:
            print(f"✅ Token abonné au topic '{TOPIC}' avec succès !")
        else:
            print(f"⚠️  Résultat : {result}")
    else:
        print(f"❌ Erreur {response.status_code} :")
        print(f"   {response.text}")

    return response


def main():
    print("╔════════════════════════════════════════╗")
    print("║   CTA Pratique — Notifications Push    ║")
    print("╚════════════════════════════════════════╝")
    print()

    # Mode: subscribe
    if '--subscribe' in sys.argv:
        idx = sys.argv.index('--subscribe')
        if idx + 1 < len(sys.argv):
            token = sys.argv[idx + 1]
        else:
            token = input("Collez le token FCM (depuis la console du navigateur) :\n> ").strip()
        if not token:
            print("❌ Token vide.")
            sys.exit(1)
        subscribe_token(token)
        return

    # Mode: send to specific token
    target_token = None
    if '--token' in sys.argv:
        idx = sys.argv.index('--token')
        if idx + 1 < len(sys.argv):
            target_token = sys.argv[idx + 1]
        else:
            target_token = input("Collez le token FCM du destinataire :\n> ").strip()

    # Demander le titre et la description
    print("📝 Nouvelle notification\n")
    title = input("Titre : ").strip()
    if not title:
        print("❌ Le titre est obligatoire.")
        sys.exit(1)

    body = input("Description : ").strip()
    if not body:
        print("❌ La description est obligatoire.")
        sys.exit(1)

    # Confirmation
    print()
    print(f"  Titre       : {title}")
    print(f"  Description : {body}")
    print(f"  Destination : {'Token spécifique' if target_token else f'Tous (topic: {TOPIC})'}")
    print()
    confirm = input("Envoyer ? (o/N) : ").strip().lower()

    if confirm in ('o', 'oui', 'y', 'yes'):
        send_notification(title, body, token=target_token)
    else:
        print("Annulé.")


if __name__ == '__main__':
    main()
