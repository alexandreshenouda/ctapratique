#!/usr/bin/env python3
"""
CTA Pratique — Envoyer des notifications push à tous les utilisateurs.

Les tokens sont collectés automatiquement dans Firestore quand les
utilisateurs acceptent les notifications sur le site.

Prérequis (une seule fois) :
  pip3 install google-auth requests

Configuration :
  Placez votre fichier service-account.json dans le même dossier que ce script.
  (Firebase Console > Project Settings > Service accounts > Generate new private key)
"""

import os
import sys
import json
import threading
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext

try:
    import requests
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
except ImportError:
    root = tk.Tk()
    root.withdraw()
    messagebox.showerror(
        "Dépendances manquantes",
        "Installez les dépendances avec :\n\npip3 install google-auth requests"
    )
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

# --- Colors ---
BG = '#F5F7FA'
PRIMARY = '#0066CC'
PRIMARY_HOVER = '#0052A3'
CARD_BG = '#FFFFFF'
TEXT = '#333333'
TEXT_LIGHT = '#666666'
BORDER = '#E0E0E0'


def get_credentials():
    """Obtient les credentials OAuth2 à partir du fichier service account."""
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        raise FileNotFoundError(
            f"Fichier introuvable : {SERVICE_ACCOUNT_FILE}\n\n"
            "Pour l'obtenir :\n"
            "1. Firebase Console > Project Settings > Service accounts\n"
            "2. Cliquez 'Generate new private key'\n"
            f"3. Enregistrez sous : {SERVICE_ACCOUNT_FILE}"
        )
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    credentials.refresh(Request())
    return credentials


def fetch_all_tokens():
    """Récupère tous les tokens FCM depuis Firestore."""
    credentials = get_credentials()
    headers = {'Authorization': f'Bearer {credentials.token}'}

    tokens = []
    url = FIRESTORE_URL + '?pageSize=300'

    while url:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception(f"Erreur Firestore ({response.status_code}): {response.text}")

        data = response.json()
        documents = data.get('documents', [])

        for doc in documents:
            fields = doc.get('fields', {})
            token_field = fields.get('token', {})
            token_value = token_field.get('stringValue', '')
            if token_value:
                tokens.append(token_value)

        # Pagination
        next_page_token = data.get('nextPageToken')
        if next_page_token:
            url = FIRESTORE_URL + f'?pageSize=300&pageToken={next_page_token}'
        else:
            url = None

    return tokens


def send_notification(title, body, token):
    """Envoie une notification à un token spécifique via FCM v1 API."""
    credentials = get_credentials()
    headers = {
        'Authorization': f'Bearer {credentials.token}',
        'Content-Type': 'application/json',
    }
    message = {
        'message': {
            'token': token,
            'notification': {
                'title': title,
                'body': body,
            },
        }
    }
    response = requests.post(FCM_SEND_URL, headers=headers, json=message)
    return response


class NotificationApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CTA Pratique — Notifications")
        self.root.configure(bg=BG)
        self.root.resizable(False, False)

        w, h = 500, 620
        x = (self.root.winfo_screenwidth() - w) // 2
        y = (self.root.winfo_screenheight() - h) // 2
        self.root.geometry(f'{w}x{h}+{x}+{y}')

        self._build_ui()
        # Charger le nombre d'utilisateurs au démarrage
        self._refresh_user_count()

    def _build_ui(self):
        main = tk.Frame(self.root, bg=BG, padx=24, pady=16)
        main.pack(fill='both', expand=True)

        # Header
        tk.Label(main, text="Envoyer une notification",
                 font=('SF Pro Display', 20, 'bold'),
                 bg=BG, fg=PRIMARY).pack(anchor='w')

        self.user_count_var = tk.StringVar(value="Chargement...")
        tk.Label(main, textvariable=self.user_count_var,
                 font=('SF Pro Text', 11), bg=BG, fg=TEXT_LIGHT).pack(anchor='w', pady=(0, 16))

        # Card
        card = tk.Frame(main, bg=CARD_BG, padx=20, pady=16, relief='solid',
                         bd=1, highlightbackground=BORDER)
        card.pack(fill='x')

        # Title
        tk.Label(card, text="Titre", font=('SF Pro Text', 12, 'bold'),
                 bg=CARD_BG, fg=TEXT).pack(anchor='w', pady=(4, 4))
        self.title_entry = tk.Entry(card, font=('SF Pro Text', 13), relief='solid',
                                     bd=1, highlightthickness=0)
        self.title_entry.pack(fill='x', ipady=6)

        # Body
        tk.Label(card, text="Message", font=('SF Pro Text', 12, 'bold'),
                 bg=CARD_BG, fg=TEXT).pack(anchor='w', pady=(14, 4))
        self.body_text = tk.Text(card, font=('SF Pro Text', 13), relief='solid',
                                  bd=1, height=3, highlightthickness=0, wrap='word')
        self.body_text.pack(fill='x')

        # Send button
        self.send_btn = tk.Button(card, text="📤  Envoyer à tous les utilisateurs",
                                   font=('SF Pro Text', 13, 'bold'), bg=PRIMARY, fg='white',
                                   relief='flat', cursor='hand2', padx=16, pady=10,
                                   command=self._on_send, activebackground=PRIMARY_HOVER,
                                   activeforeground='white')
        self.send_btn.pack(fill='x', pady=(18, 8))

        # Refresh button
        tk.Button(card, text="🔄  Actualiser le nombre d'utilisateurs",
                  font=('SF Pro Text', 11), bg='#f0f0f0', fg=TEXT,
                  relief='flat', cursor='hand2', pady=6,
                  command=self._refresh_user_count).pack(fill='x', pady=(0, 4))

        # Log
        tk.Label(main, text="Journal", font=('SF Pro Text', 12, 'bold'),
                 bg=BG, fg=TEXT).pack(anchor='w', pady=(16, 4))

        self.log = scrolledtext.ScrolledText(main, font=('Menlo', 10), height=14,
                                              relief='solid', bd=1, bg='#FAFAFA',
                                              highlightthickness=0, state='disabled')
        self.log.pack(fill='both', expand=True)

        # Status
        self.status_var = tk.StringVar(value="Prêt")
        tk.Label(main, textvariable=self.status_var, font=('SF Pro Text', 10),
                 bg=BG, fg=TEXT_LIGHT).pack(anchor='w', pady=(6, 0))

    def _log(self, msg):
        self.log.config(state='normal')
        self.log.insert('end', msg + '\n')
        self.log.see('end')
        self.log.config(state='disabled')

    def _refresh_user_count(self):
        def do_fetch():
            try:
                tokens = fetch_all_tokens()
                count = len(tokens)
                self.root.after(0, lambda: self.user_count_var.set(
                    f"📱 {count} utilisateur(s) recevront la notification"))
            except Exception as e:
                err = str(e)
                self.root.after(0, lambda: self.user_count_var.set("⚠️ Impossible de charger les utilisateurs"))
                self.root.after(0, lambda: self._log(f"❌ {err}"))

        threading.Thread(target=do_fetch, daemon=True).start()

    def _on_send(self):
        title = self.title_entry.get().strip()
        body = self.body_text.get('1.0', 'end').strip()

        if not title:
            messagebox.showwarning("Champ manquant", "Le titre est obligatoire.")
            return
        if not body:
            messagebox.showwarning("Champ manquant", "Le message est obligatoire.")
            return

        confirm = messagebox.askyesno(
            "Confirmer l'envoi",
            f"Envoyer cette notification à tous les utilisateurs ?\n\n"
            f"Titre : {title}\n"
            f"Message : {body}"
        )
        if not confirm:
            return

        self.send_btn.config(state='disabled')
        self.status_var.set("Envoi en cours...")
        self._log(f"⏳ Récupération des tokens depuis Firestore...")

        def do_send():
            try:
                # 1. Fetch all tokens from Firestore
                tokens = fetch_all_tokens()
                total = len(tokens)
                self.root.after(0, lambda: self._log(f"📱 {total} utilisateur(s) trouvé(s)"))

                if total == 0:
                    self.root.after(0, lambda: self._log("⚠️ Aucun utilisateur enregistré."))
                    self.root.after(0, lambda: self.send_btn.config(state='normal'))
                    self.root.after(0, lambda: self.status_var.set("Aucun destinataire"))
                    return

                # 2. Send to each token
                success = 0
                failed = 0
                for i, token in enumerate(tokens):
                    try:
                        resp = send_notification(title, body, token)
                        if resp.status_code == 200:
                            success += 1
                        else:
                            failed += 1
                            error_detail = resp.text[:100]
                            self.root.after(0, lambda d=error_detail:
                                self._log(f"  ⚠️ Échec: {d}"))
                    except Exception as te:
                        failed += 1

                    # Progress update every 5 tokens
                    if (i + 1) % 5 == 0 or i == total - 1:
                        s, f, t = success, failed, total
                        self.root.after(0, lambda s=s, f=f, t=t:
                            self.status_var.set(f"Envoi... {s + f}/{t}"))

                s, f = success, failed
                self.root.after(0, lambda: self._log(
                    f"✅ Terminé : {s} envoyé(s), {f} échec(s)"))
                self.root.after(0, lambda: self.status_var.set(
                    f"✅ Notification envoyée à {s}/{s + f} utilisateur(s)"))
                self.root.after(0, lambda: self.send_btn.config(state='normal'))

                if success > 0:
                    self.root.after(0, lambda: self.title_entry.delete(0, 'end'))
                    self.root.after(0, lambda: self.body_text.delete('1.0', 'end'))

            except Exception as e:
                err_msg = f"{type(e).__name__}: {e}"
                self.root.after(0, lambda: self._log(f"❌ {err_msg}"))
                self.root.after(0, lambda: self.status_var.set("Erreur"))
                self.root.after(0, lambda: self.send_btn.config(state='normal'))
                self.root.after(0, lambda: messagebox.showerror("Erreur", err_msg))

        threading.Thread(target=do_send, daemon=True).start()


if __name__ == '__main__':
    root = tk.Tk()
    app = NotificationApp(root)
    root.mainloop()
