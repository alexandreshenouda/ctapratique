# Configuration du formulaire de contact - Guide Web3Forms

Le formulaire de contact utilise **Web3Forms**, un service gratuit spécialement conçu pour les applications JavaScript/React avec support CORS complet.

## Avantages de Web3Forms

✅ **Support CORS complet** - Fonctionne en localhost ET en production  
✅ **Gratuit** : 250 emails/mois  
✅ **Configuration ultra-simple** : 2 minutes  
✅ **Pas de compte** à créer (juste une clé API)  
✅ **Tableau de bord** pour voir les messages  
✅ **Protection anti-spam** intégrée  
✅ **Emails bien formatés** automatiquement  

## Configuration (2 minutes !)

### Étape 1 : Obtenir votre Access Key

1. **Allez sur** https://web3forms.com/
2. **Entrez votre email** : `felzou23@gmail.com` (ou votre email)
3. **Cliquez sur "Get Free Access Key"**
4. **Vérifiez votre email** - Vous recevrez instantanément :
   - Votre Access Key (ex: `abc123-xyz456-789def`)
   - Un lien vers votre tableau de bord

### Étape 2 : Configurer l'application

1. Ouvrez le fichier `src/config/contact.config.ts`
2. Remplacez `YOUR_ACCESS_KEY` par votre vraie clé :

```typescript
export const CONTACT_CONFIG = {
  // Collez votre Access Key ici (reçue par email)
  accessKey: 'abc123-xyz456-789def',  // ← Votre vraie clé
  
  recipientEmail: 'felzou23@gmail.com',
  
  options: {
    subject: 'Nouveau message depuis le formulaire de contact',
  }
};
```

3. Sauvegardez le fichier

### Étape 3 : Tester

1. Testez le formulaire (localhost ou production)
2. Vérifiez votre email
3. ✅ Ça marche !

## C'est tout !

Vous n'avez rien d'autre à faire. Le formulaire fonctionne maintenant partout !

## Tableau de bord Web3Forms

Pour voir tous les messages reçus :

1. Allez sur https://web3forms.com/
2. Cliquez sur "Access Dashboard"
3. Entrez l'Access Key que vous avez reçue par email
4. Vous verrez tous vos messages avec :
   - Date et heure
   - Nom et email de l'expéditeur
   - Message complet
   - Possibilité de répondre directement

## Format des emails reçus

Chaque message que vous recevrez contiendra :
- **From** : Nom et email du contact
- **Phone** : Téléphone (si renseigné)
- **Address** : Adresse (si renseignée)
- **City** : Ville (si renseignée)
- **Subject** : Objet du message
- **Message** : Le contenu

Les emails sont automatiquement bien formatés et vous pouvez répondre directement en cliquant sur "Reply".

## Options avancées (optionnel)

### Personnaliser l'objet de l'email

Dans `contact.config.ts` :

```typescript
options: {
  subject: 'Nouveau contact depuis mon site',
}
```

### Rediriger après envoi

Si vous voulez rediriger vers une page de remerciement :

```typescript
// Dans ContactScreen.tsx, après data.success :
if (data.success) {
  // Redirection web
  if (Platform.OS === 'web') {
    window.location.href = 'https://monsite.com/merci';
  }
  // Ou simplement afficher l'alerte comme actuellement
}
```

### Webhook pour intégrations

Web3Forms supporte les webhooks si vous voulez envoyer les données vers Zapier, Make.com, ou votre propre API.

Voir : https://docs.web3forms.com/how-to-guides/webhooks

## Dépannage

### "Configuration requise"

Si vous voyez ce message, c'est que vous n'avez pas encore remplacé `YOUR_ACCESS_KEY` dans le fichier `contact.config.ts`.

### Je ne reçois pas les messages

1. **Vérifiez votre Access Key** : Elle doit être copiée exactement depuis l'email
2. **Vérifiez vos spams** : Les premiers emails peuvent arriver dans les spams
3. **Consultez le dashboard** : Allez sur https://web3forms.com/ pour voir si les messages sont reçus
4. **Vérifiez votre email** : Assurez-vous que l'email configuré est correct

### "Erreur lors de l'envoi"

- Vérifiez votre connexion internet
- Vérifiez que l'Access Key est valide
- Consultez la console du navigateur pour plus de détails
- Vérifiez que vous n'avez pas dépassé la limite de 250 emails/mois

### Les emails arrivent en spam

Marquez les emails de Web3Forms comme "Non spam" dans votre client email. Après quelques messages, ils arriveront dans votre boîte principale.

## Limites du plan gratuit

- **250 emails/mois** (largement suffisant pour la plupart des sites)
- **1 Access Key** gratuite
- **Stockage des messages** : 30 jours dans le dashboard

Si vous dépassez 250 emails/mois, vous pouvez passer au plan Pro (5$/mois) pour 10,000 emails/mois.

## Pourquoi Web3Forms plutôt que FormSubmit ?

| Feature | Web3Forms | FormSubmit |
|---------|-----------|------------|
| Support CORS | ✅ Complet | ❌ Limité |
| Fonctionne en localhost | ✅ Oui | ❌ Non |
| Tableau de bord | ✅ Oui | ❌ Non |
| Webhooks | ✅ Oui | ❌ Non |
| Configuration | 2 minutes | 5 minutes |
| Confirmation requise | ❌ Non | ✅ Oui (email) |

Web3Forms est **spécialement conçu** pour les applications JavaScript modernes comme React/React Native.

## Support

- **Documentation** : https://docs.web3forms.com/
- **Support email** : support@web3forms.com
- **Discord** : https://discord.gg/web3forms

## Sécurité

Web3Forms inclut automatiquement :
- Protection anti-bot (honeypot)
- Limitation du taux d'envoi
- Validation des emails
- Pas d'exposition de votre Access Key (sécurisée côté serveur)

Votre Access Key peut être utilisée publiquement dans votre code client en toute sécurité ! 🔒

## Migration depuis FormSubmit

Si vous migrez depuis FormSubmit, vous n'avez qu'à :
1. Obtenir votre Access Key Web3Forms
2. Remplacer dans `contact.config.ts`
3. C'est tout ! Le code est déjà mis à jour

Les données envoyées sont les mêmes, juste l'API qui change.
