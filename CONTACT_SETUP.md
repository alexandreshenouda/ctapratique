# Configuration du formulaire de contact - Guide FormSubmit

Le formulaire de contact utilise **FormSubmit**, un service gratuit et ultra-simple pour recevoir les messages par email.

## Avantages de FormSubmit

✅ **Totalement gratuit** et illimité  
✅ **Aucune inscription** requise  
✅ **Aucune clé API** à gérer  
✅ **Configuration en 2 minutes**  
✅ **Protection anti-spam** intégrée  
✅ **Emails bien formatés** automatiquement  

## Configuration (ultra-simple !)

### Étape 1 : Modifier l'email de destination

1. Ouvrez le fichier `src/config/contact.config.ts`
2. Remplacez `contact@ctapratique.com` par votre email :

```typescript
export const CONTACT_CONFIG = {
  recipientEmail: 'votre-email@example.com',  // ← Mettez votre email ici
  
  options: {
    subject: 'Nouveau message depuis le formulaire de contact',
  }
};
```

3. Sauvegardez le fichier

### Étape 2 : Activer l'email (première fois uniquement)

**Important** : La première fois qu'un message est envoyé à votre email, FormSubmit vous enverra un email de confirmation.

1. Testez le formulaire en envoyant un premier message
2. Vérifiez votre boîte email (et spam/courrier indésirable)
3. Cliquez sur le lien de confirmation dans l'email de FormSubmit
4. C'est tout ! Tous les messages suivants arriveront directement

## C'est tout !

Vous n'avez rien d'autre à faire. Le formulaire est maintenant fonctionnel.

## Format des emails reçus

Chaque message que vous recevrez contiendra :
- **Name** : Nom du contact
- **Email** : Son adresse email (vous pouvez répondre directement)
- **Phone** : Téléphone (si renseigné)
- **Address** : Adresse (si renseignée)
- **City** : Ville (si renseignée)
- **Subject** : Objet du message
- **Message** : Le contenu du message

Les emails sont automatiquement formatés en tableau pour une lecture facile.

## Options avancées (optionnel)

Vous pouvez personnaliser d'autres paramètres dans `contact.config.ts` :

```typescript
export const CONTACT_CONFIG = {
  recipientEmail: 'votre-email@example.com',
  
  options: {
    // Personnaliser l'objet de l'email
    subject: 'Nouveau message depuis mon site',
  }
};
```

## Dépannage

### Je ne reçois pas les messages

1. **Vérifiez vos spams** : Les premiers emails peuvent arriver dans les spams
2. **Confirmez votre email** : Vérifiez que vous avez cliqué sur le lien de confirmation
3. **Vérifiez l'email configuré** : Assurez-vous que l'email dans `contact.config.ts` est correct
4. **Testez avec un autre email** : Essayez avec une autre adresse (Gmail, Outlook, etc.)

### "Erreur lors de l'envoi"

- Vérifiez votre connexion internet
- Vérifiez que l'adresse email est valide
- Consultez la console du navigateur pour plus de détails

### Les emails arrivent en spam

C'est normal au début. Après quelques messages, votre client email apprendra que ce n'est pas du spam. Vous pouvez aussi :
- Marquer les emails FormSubmit comme "Non spam"
- Ajouter `formsubmit.co` à votre liste de contacts

## Limitations

FormSubmit est gratuit et illimité, mais :
- Pas d'API pour récupérer les messages programmatiquement
- Pas de tableau de bord pour consulter l'historique
- Les messages sont uniquement envoyés par email

C'est parfait pour un formulaire de contact simple !

## Alternative : Web3Forms

Si vous avez besoin de plus de contrôle, vous pouvez utiliser **Web3Forms** (gratuit jusqu'à 250 emails/mois) :
- Tableau de bord pour voir les messages
- Webhooks disponibles
- Configuration similaire mais avec une clé API

## Support

- Documentation FormSubmit : https://formsubmit.co/
- Guide FormSubmit : https://formsubmit.co/documentation

## Sécurité

FormSubmit inclut automatiquement :
- Protection contre les bots (honeypot)
- Limitation du taux d'envoi
- Validation des emails
- Pas d'exposition de votre vraie adresse email dans le code client

Votre email reste privé et protégé ! 🔒

