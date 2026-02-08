#!/usr/bin/env python3
"""
CTA Pratique — Interface d'envoi de notifications push.

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
TOPIC = 'all'
FCM_SEND_URL = f'https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send'
IID_SUBSCRIBE_URL = 'https://iid.googleapis.com/iid/v1:batchAdd'
SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']

# --- Colors ---
BG = '#F5F7FA'
PRIMARY = '#0066CC'
PRIMARY_HOVER = '#0052A3'
SUCCESS = '#2E7D32'
ERROR = '#C62828'
CARD_BG = '#FFFFFF'
TEXT = '#333333'
TEXT_LIGHT = '#666666'
BORDER = '#E0E0E0'


def get_access_token():
    """Obtient un token OAuth2."""
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
    return credentials.token


def send_notification(title, body, token=None):
    """Envoie une notification via FCM v1 API."""
    access_token = get_access_token()
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    message = {'notification': {'title': title, 'body': body}}
    if token:
        message['token'] = token
    else:
        message['topic'] = TOPIC

    response = requests.post(FCM_SEND_URL, headers=headers, json={'message': message})
    return response


def subscribe_token(fcm_token):
    """Abonne un token FCM au topic."""
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
    return response


class NotificationApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CTA Pratique — Notifications")
        self.root.configure(bg=BG)
        self.root.resizable(False, False)

        # Window size and center
        w, h = 520, 700
        x = (self.root.winfo_screenwidth() - w) // 2
        y = (self.root.winfo_screenheight() - h) // 2
        self.root.geometry(f'{w}x{h}+{x}+{y}')

        self._build_ui()

    def _build_ui(self):
        # Main container
        main = tk.Frame(self.root, bg=BG, padx=24, pady=16)
        main.pack(fill='both', expand=True)

        # Header
        tk.Label(main, text="Notifications Push", font=('SF Pro Display', 20, 'bold'),
                 bg=BG, fg=PRIMARY).pack(anchor='w')
        tk.Label(main, text="CTA Pratique — Firebase Cloud Messaging",
                 font=('SF Pro Text', 11), bg=BG, fg=TEXT_LIGHT).pack(anchor='w', pady=(0, 16))

        # --- Send notification card ---
        send_card = self._card(main, "Envoyer une notification")

        tk.Label(send_card, text="Titre", font=('SF Pro Text', 12, 'bold'),
                 bg=CARD_BG, fg=TEXT).pack(anchor='w', pady=(8, 4))
        self.title_entry = tk.Entry(send_card, font=('SF Pro Text', 13), relief='solid',
                                     bd=1, highlightthickness=0)
        self.title_entry.pack(fill='x', ipady=6)

        tk.Label(send_card, text="Description", font=('SF Pro Text', 12, 'bold'),
                 bg=CARD_BG, fg=TEXT).pack(anchor='w', pady=(12, 4))
        self.body_text = tk.Text(send_card, font=('SF Pro Text', 13), relief='solid',
                                  bd=1, height=3, highlightthickness=0, wrap='word')
        self.body_text.pack(fill='x')

        # Destination
        tk.Label(send_card, text="Destination", font=('SF Pro Text', 12, 'bold'),
                 bg=CARD_BG, fg=TEXT).pack(anchor='w', pady=(12, 4))

        dest_frame = tk.Frame(send_card, bg=CARD_BG)
        dest_frame.pack(fill='x')

        self.dest_var = tk.StringVar(value='topic')
        tk.Radiobutton(dest_frame, text="Tous les abonnés", variable=self.dest_var,
                        value='topic', bg=CARD_BG, fg=TEXT, font=('SF Pro Text', 11),
                        command=self._toggle_token_field).pack(side='left')
        tk.Radiobutton(dest_frame, text="Token spécifique", variable=self.dest_var,
                        value='token', bg=CARD_BG, fg=TEXT, font=('SF Pro Text', 11),
                        command=self._toggle_token_field).pack(side='left', padx=(16, 0))

        self.send_token_frame = tk.Frame(send_card, bg=CARD_BG)
        self.send_token_entry = tk.Entry(self.send_token_frame, font=('SF Pro Text', 11),
                                          relief='solid', bd=1, highlightthickness=0)
        self.send_token_entry.insert(0, "Collez le token FCM ici...")
        self.send_token_entry.config(fg='#999')
        self.send_token_entry.bind('<FocusIn>', self._clear_placeholder)
        self.send_token_entry.pack(fill='x', ipady=4, pady=(4, 0))

        # Send button
        self.send_btn = tk.Button(send_card, text="📤  Envoyer la notification",
                                   font=('SF Pro Text', 13, 'bold'), bg=PRIMARY, fg='white',
                                   relief='flat', cursor='hand2', padx=16, pady=10,
                                   command=self._on_send, activebackground=PRIMARY_HOVER,
                                   activeforeground='white')
        self.send_btn.pack(fill='x', pady=(16, 8))

        # --- Subscribe card ---
        sub_card = self._card(main, "Abonner un appareil")

        tk.Label(sub_card, text="Token FCM (depuis la console du navigateur)",
                 font=('SF Pro Text', 11), bg=CARD_BG, fg=TEXT_LIGHT).pack(anchor='w', pady=(8, 4))
        self.sub_token_entry = tk.Entry(sub_card, font=('SF Pro Text', 11), relief='solid',
                                         bd=1, highlightthickness=0)
        self.sub_token_entry.pack(fill='x', ipady=5)

        self.sub_btn = tk.Button(sub_card, text="➕  Abonner au topic 'all'",
                                  font=('SF Pro Text', 12, 'bold'), bg='#388E3C', fg='white',
                                  relief='flat', cursor='hand2', padx=12, pady=8,
                                  command=self._on_subscribe, activebackground='#2E7D32',
                                  activeforeground='white')
        self.sub_btn.pack(fill='x', pady=(12, 8))

        # --- Log area ---
        log_label = tk.Label(main, text="Journal", font=('SF Pro Text', 12, 'bold'),
                              bg=BG, fg=TEXT)
        log_label.pack(anchor='w', pady=(12, 4))

        self.log = scrolledtext.ScrolledText(main, font=('Menlo', 10), height=6,
                                              relief='solid', bd=1, bg='#FAFAFA',
                                              highlightthickness=0, state='disabled')
        self.log.pack(fill='both', expand=True)

        # Status bar
        self.status_var = tk.StringVar(value="Prêt")
        tk.Label(main, textvariable=self.status_var, font=('SF Pro Text', 10),
                 bg=BG, fg=TEXT_LIGHT).pack(anchor='w', pady=(6, 0))

    def _card(self, parent, title):
        """Crée une carte avec titre."""
        tk.Label(parent, text=title, font=('SF Pro Text', 14, 'bold'),
                 bg=BG, fg=TEXT).pack(anchor='w', pady=(12, 4))
        card = tk.Frame(parent, bg=CARD_BG, padx=16, pady=8, relief='solid',
                         bd=1, highlightbackground=BORDER)
        card.pack(fill='x')
        return card

    def _toggle_token_field(self):
        if self.dest_var.get() == 'token':
            self.send_token_frame.pack(fill='x', pady=(4, 0))
        else:
            self.send_token_frame.pack_forget()

    def _clear_placeholder(self, event):
        if self.send_token_entry.get() == "Collez le token FCM ici...":
            self.send_token_entry.delete(0, 'end')
            self.send_token_entry.config(fg=TEXT)

    def _log(self, msg, tag=None):
        self.log.config(state='normal')
        self.log.insert('end', msg + '\n', tag)
        self.log.see('end')
        self.log.config(state='disabled')

    def _set_buttons_state(self, state):
        self.send_btn.config(state=state)
        self.sub_btn.config(state=state)

    def _on_send(self):
        title = self.title_entry.get().strip()
        body = self.body_text.get('1.0', 'end').strip()

        if not title:
            messagebox.showwarning("Champ manquant", "Le titre est obligatoire.")
            return
        if not body:
            messagebox.showwarning("Champ manquant", "La description est obligatoire.")
            return

        token = None
        if self.dest_var.get() == 'token':
            token = self.send_token_entry.get().strip()
            if not token or token == "Collez le token FCM ici...":
                messagebox.showwarning("Champ manquant", "Collez un token FCM valide.")
                return

        dest_label = f"token: {token[:20]}..." if token else f"topic: {TOPIC}"
        self._log(f"⏳ Envoi → {dest_label}")
        self.status_var.set("Envoi en cours...")
        self._set_buttons_state('disabled')

        def do_send():
            try:
                resp = send_notification(title, body, token=token)
                self.root.after(0, lambda: self._handle_send_result(resp, title))
            except Exception as e:
                err_msg = str(e)
                self.root.after(0, lambda: self._handle_error(err_msg))

        threading.Thread(target=do_send, daemon=True).start()

    def _handle_send_result(self, resp, title):
        self._set_buttons_state('normal')
        if resp.status_code == 200:
            msg_id = resp.json().get('name', '')
            self._log(f"✅ Envoyé : \"{title}\"")
            self.status_var.set("Notification envoyée avec succès !")
            self.title_entry.delete(0, 'end')
            self.body_text.delete('1.0', 'end')
        else:
            self._log(f"❌ Erreur {resp.status_code} : {resp.text}")
            self.status_var.set(f"Erreur {resp.status_code}")

    def _on_subscribe(self):
        token = self.sub_token_entry.get().strip()
        if not token:
            messagebox.showwarning("Champ manquant", "Collez un token FCM valide.")
            return

        self._log(f"⏳ Abonnement du token : {token[:20]}...")
        self.status_var.set("Abonnement en cours...")
        self._set_buttons_state('disabled')

        def do_subscribe():
            try:
                resp = subscribe_token(token)
                self.root.after(0, lambda: self._handle_subscribe_result(resp))
            except Exception as e:
                err_msg = str(e)
                self.root.after(0, lambda: self._handle_error(err_msg))

        threading.Thread(target=do_subscribe, daemon=True).start()

    def _handle_subscribe_result(self, resp):
        self._set_buttons_state('normal')
        if resp.status_code == 200:
            result = resp.json()
            errors = result.get('results', [])
            if errors and errors[0] == {}:
                self._log(f"✅ Token abonné au topic '{TOPIC}'")
                self.status_var.set("Appareil abonné avec succès !")
                self.sub_token_entry.delete(0, 'end')
            else:
                self._log(f"⚠️  Résultat inattendu : {result}")
                self.status_var.set("Résultat inattendu")
        else:
            self._log(f"❌ Erreur {resp.status_code} : {resp.text}")
            self.status_var.set(f"Erreur {resp.status_code}")

    def _handle_error(self, msg):
        self._set_buttons_state('normal')
        self._log(f"❌ {msg}")
        self.status_var.set("Erreur")
        messagebox.showerror("Erreur", msg)


if __name__ == '__main__':
    root = tk.Tk()
    app = NotificationApp(root)
    root.mainloop()
