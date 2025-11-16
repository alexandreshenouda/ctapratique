# Site HTML - Stéphane Formateur

Site web HTML/CSS/JavaScript pur pour la plateforme de formation en hygiène et stérilisation dentaire.

## 🎯 Avantages du site HTML pur

- ✅ **Ultra-rapide** - Pas de framework lourd
- ✅ **Simple** - HTML, CSS et JavaScript vanilla
- ✅ **Compatible** - Fonctionne sur tous les navigateurs
- ✅ **Facile à déployer** - Drag & drop sur n'importe quel hébergeur
- ✅ **Facile à maintenir** - Code clair et lisible
- ✅ **SEO-friendly** - HTML sémantique
- ✅ **Responsive** - S'adapte à tous les écrans

## 📁 Structure du projet

```
html-site/
├── index.html          # Page principale
├── css/
│   └── styles.css      # Styles CSS
├── js/
│   ├── config.js       # Configuration (Web3Forms)
│   ├── navigation.js   # Navigation entre onglets
│   ├── documents.js    # Gestion des documents
│   ├── contact.js      # Formulaire de contact
│   └── main.js         # Script principal
├── assets/
│   └── logo.jpg        # Logo et images
├── data/
│   └── documents.json  # Données des documents
└── README.md
```

## 🚀 Installation et configuration

### 1. Configuration du formulaire de contact

Le formulaire utilise **Web3Forms** (gratuit, 250 emails/mois).

1. Allez sur https://web3forms.com/
2. Entrez votre email : `contact@ctapratique.com`
3. Recevez votre Access Key par email
4. Ouvrez `js/config.js` et remplacez :

```javascript
const CONFIG = {
    accessKey: 'VOTRE_ACCESS_KEY_ICI',  // ← Collez votre clé ici
    // ...
};
```

### 2. Mise à jour des documents

Pour mettre à jour les documents :

1. Éditez le fichier `../assets/documents.csv` (à la racine du projet parent)
2. Exécutez depuis la racine du projet :
   ```bash
   node scripts/generateDocumentsJSON.js
   ```
3. Le fichier `data/documents.json` sera mis à jour automatiquement

### 3. Personnalisation

#### Couleurs et styles
Modifiez les variables CSS dans `css/styles.css` :

```css
:root {
    --primary: #0066CC;
    --success: #34C759;
    --warning: #FF9500;
    /* ... */
}
```

#### Logo
Remplacez `assets/logo.jpg` par votre propre logo

#### Informations de contact
Modifiez directement dans `index.html` les sections de contact

## 🌐 Déploiement

### Option 1 : GitHub Pages (gratuit)

1. Créez un repo GitHub
2. Push le dossier `html-site` dans la branche `main`
3. Dans Settings > Pages :
   - Source : `main` branch
   - Folder : `/ (root)` ou sélectionnez le dossier `html-site`
4. Votre site sera disponible sur `https://username.github.io/repo-name/`

### Option 2 : Netlify/Vercel (gratuit)

1. Créez un compte sur [Netlify](https://netlify.com) ou [Vercel](https://vercel.com)
2. Drag & drop le dossier `html-site`
3. Votre site est en ligne instantanément !

### Option 3 : Hébergement traditionnel (FTP)

1. Uploadez tout le contenu du dossier `html-site` sur votre serveur
2. Pointez votre domaine vers ce dossier
3. C'est tout !

## 🧪 Test local

Pour tester le site en local :

### Option 1 : Python (Recommandé)
```bash
cd html-site
python -m http.server 8000
```
Ouvrez http://localhost:8000

### Option 2 : Node.js serve
```bash
npx serve html-site -p 8000
```

### Option 3 : Extension VSCode
1. Installez "Live Server" dans VSCode
2. Clic droit sur `index.html` > "Open with Live Server"

## ✨ Fonctionnalités

- **Navigation par onglets** - Accueil, Documents, Contact
- **Recherche dans les documents** - Recherche en temps réel avec groupement par catégorie
- **Formulaire de contact fonctionnel** - Avec Web3Forms (support CORS complet)
- **Design responsive** - Mobile et desktop
- **Animations fluides** - Transitions CSS modernes
- **Compatible tous navigateurs** - Chrome, Firefox, Safari, Edge

## 📝 Onglets

### Accueil
- Section hero avec logo
- Statistiques clés
- Présentation des formations
- Ateliers pratiques

### Documents
- Liste de documents professionnels
- Recherche en temps réel
- Groupement par catégorie lors de la recherche
- Liens vers documents externes

### Contact
- Informations de contact (email, téléphone)
- Formulaire complet avec validation
- Envoi via Web3Forms

## 🔧 Technologies utilisées

- **HTML5** - Sémantique et accessible
- **CSS3** - Variables CSS, Grid, Flexbox, Animations
- **JavaScript ES6+** - Modules, Fetch API, Async/Await
- **Ionicons** - Bibliothèque d'icônes (via CDN)
- **Web3Forms** - Service d'envoi d'emails

## 🎨 Design

- **Design system** cohérent avec variables CSS
- **Responsive** - Mobile-first approach
- **Accessible** - Contraste et taille de police optimaux
- **Moderne** - Effets d'ombre, transitions fluides

## 📱 Compatibilité

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (iOS et macOS)
- ✅ Mobile (iOS et Android)

## 🔒 Sécurité

- Validation côté client des formulaires
- Protection anti-spam via Web3Forms
- Pas de données sensibles exposées
- Échappement HTML pour prévenir les XSS

## 🐛 Dépannage

### Le formulaire ne s'envoie pas
- Vérifiez que l'Access Key est configurée dans `js/config.js`
- Vérifiez la console du navigateur pour les erreurs
- Testez votre connexion internet

### Les documents ne s'affichent pas
- Vérifiez que `data/documents.json` existe
- Vérifiez la console pour les erreurs de chargement
- Assurez-vous que le serveur serve bien les fichiers JSON

### Les styles ne s'appliquent pas
- Vérifiez les chemins relatifs dans `index.html`
- Videz le cache du navigateur (Ctrl+Shift+R)

## 🚀 Performance

- **Taille totale** : ~50-100 KB (sans images)
- **Temps de chargement** : < 1 seconde
- **Aucune dépendance lourde** - Juste Ionicons (CDN)
- **Optimisé** - CSS minifié, pas de JavaScript inutile

## 📄 Licence

Ce projet est privé et propriétaire.

## 💡 Support

Pour toute question :
- Email : contact@ctapratique.com
- Web : https://ctapratique.com

---

**Note** : Ce site HTML est une version simplifiée du projet React Native original. Il est conçu spécifiquement pour le web et offre une expérience utilisateur optimale sans la complexité d'un framework.

