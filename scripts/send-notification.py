#!/usr/bin/env python3
"""
CTA Pratique — Envoyer des notifications push à tous les utilisateurs (CLI).

Usage:
  python3 send-notification.py

Les tokens sont collectés automatiquement dans Firestore.

Prérequis :
  pip3 install google-auth requests
"""

import os
import sys
import json

try:
    import requests
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
except ImportError:
    print("❌ Dépendances manquantes :")
    print("   pip3 install google-auth requests")
    sys.exit(1)

# --- Configuration ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.path.join(SCRIPT_DIR, 'service-account.json')
PROJECT_ID = 'ctapratique-f302d'

FCM_SEND_URL = f'https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send'
FIRESTORE_URL = f'https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/fcm_tokens'
SCOPES = [
    'https://www.googleapis.com/auth/firebase.messaging',
    'https://www.googleapis.com/auth/datastore',
]


def get_credentials():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"❌ Fichier introuvable : {SERVICE_ACCOUNT_FILE}")
        print()
        print("Pour l'obtenir :")
        print("  1. Firebase Console > Project Settings > Service accounts")
        print("  2. Cliquez 'Generate new private key'")
        print(f"  3. Enregistrez sous : {SERVICE_ACCOUNT_FILE}")
        sys.exit(1)

    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    credentials.refresh(Request())
    return credentials


def fetch_all_tokens():
    credentials = get_credentials()
    headers = {'Authorization': f'Bearer {credentials.token}'}
    tokens = []
    url = FIRESTORE_URL + '?pageSize=300'

    while url:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"❌ Erreur Firestore ({response.status_code}): {response.text}")
            sys.exit(1)

        data = response.json()
        for doc in data.get('documents', []):
            token_value = doc.get('fields', {}).get('token', {}).get('stringValue', '')
            if token_value:
                tokens.append(token_value)

        next_page_token = data.get('nextPageToken')
        url = FIRESTORE_URL + f'?pageSize=300&pageToken={next_page_token}' if next_page_token else None

    return tokens


def send_notification(title, body, token, credentials):
    headers = {
        'Authorization': f'Bearer {credentials.token}',
        'Content-Type': 'application/json',
    }
    message = {
        'message': {
            'token': token,
            'notification': {'title': title, 'body': body},
        }
    }
    return requests.post(FCM_SEND_URL, headers=headers, json=message)


def main():
    print("╔════════════════════════════════════════╗")
    print("║   CTA Pratique — Notifications Push    ║")
    print("╚════════════════════════════════════════╝")
    print()

    # Fetch tokens
    print("📱 Récupération des utilisateurs...")
    tokens = fetch_all_tokens()
    print(f"   {len(tokens)} utilisateur(s) enregistré(s)")
    print()

    if not tokens:
        print("⚠️  Aucun utilisateur n'a encore accepté les notifications.")
        sys.exit(0)

    # Ask for notification content
    title = input("Titre : ").strip()
    if not title:
        print("❌ Le titre est obligatoire.")
        sys.exit(1)

    body = input("Message : ").strip()
    if not body:
        print("❌ Le message est obligatoire.")
        sys.exit(1)

    print()
    print(f"  Titre   : {title}")
    print(f"  Message : {body}")
    print(f"  Envoi à : {len(tokens)} utilisateur(s)")
    print()
    confirm = input("Envoyer ? (o/N) : ").strip().lower()
    if confirm not in ('o', 'oui', 'y', 'yes'):
        print("Annulé.")
        sys.exit(0)

    # Send
    credentials = get_credentials()
    success, failed = 0, 0
    for token in tokens:
        resp = send_notification(title, body, token, credentials)
        if resp.status_code == 200:
            success += 1
        else:
            failed += 1
            print(f"  ⚠️ Échec : {resp.text[:80]}")

    print()
    print(f"✅ Terminé : {success} envoyé(s), {failed} échec(s)")


if __name__ == '__main__':
    main()
