# Application Stéphane

Une application React Native cross-platform construite avec Expo qui fonctionne sur Android, iOS et navigateurs web. L'application s'inspire de la structure professionnelle de [ctapratique.com](https://www.ctapratique.com/) et se concentre sur le contenu de formation professionnelle.

## Fonctionnalités

- **Cross-Platform** : Fonctionne sur Android, iOS et navigateurs web
- **Interface Professionnelle** : Inspirée de la structure de ctapratique.com
- **Écran d'Accueil** : Section hero avec statistiques et présentation professionnelle
- **Formation** : Programmes de formation détaillés et ateliers
- **Contact** : Formulaire de contact fonctionnel avec Web3Forms (gratuit, support CORS)
- **Documents** : Recherche avancée dans les documents avec affichage groupé
- **Interface Moderne** : Design épuré et professionnel avec styles spécifiques à chaque plateforme

## Démarrage

### Prérequis

- Node.js (v16 ou plus récent)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Cloner le dépôt :
```bash
git clone <repository-url>
cd stephane-app
```

2. Installer les dépendances :
```bash
npm install
```

3. **Configurer le formulaire de contact** (2 minutes ⚡) :
   - Ouvrez `src/config/contact.config.ts`
   - Remplacez l'email par le vôtre
   - Consultez `CONTACT_SETUP.md` pour les détails

4. Démarrer le serveur de développement :
```bash
npm start
```

### Exécution sur Différentes Plateformes

- **Web** : `npm run web` ou appuyez sur `w` dans le terminal
- **Android** : `npm run android` ou appuyez sur `a` dans le terminal (nécessite un émulateur Android ou un appareil)
- **iOS** : `npm run ios` ou appuyez sur `i` dans le terminal (nécessite un simulateur iOS ou un appareil, macOS uniquement)

## Déploiement Web

### Déploiement sur GitHub Pages

Pour déployer sur GitHub Pages :

```bash
# Construire l'application
npm run build:web

# Installer gh-pages (première fois seulement)
npm install --save-dev gh-pages

# Déployer
npx gh-pages -d dist
```

Consultez `DEPLOY_GITHUB_PAGES.md` pour le guide complet avec GitHub Actions.

### 🔐 Build Sécurisé avec Mot de Passe

Pour protéger votre application avec un mot de passe et chiffrer le contenu :

```bash
# Construire l'application avec chiffrement
npm run build:web:secure

# Alternative : Build sécurisé et création d'une archive
npm run deploy:prepare:secure
```

**Mot de passe par défaut** : `CTP2026`

Le build sécurisé :
- ✅ Chiffre tous les fichiers JS et CSS avec AES-256
- ✅ Crée une page de login professionnelle
- ✅ Protège contre l'accès non autorisé
- ✅ Ne stocke jamais le mot de passe en clair
- ✅ Compatible avec GitHub Pages et tous les hébergeurs statiques

⚠️ **Note** : Il s'agit d'une protection côté client efficace contre les utilisateurs occasionnels, mais pas contre des attaques déterminées. Pour une sécurité maximale, utilisez une authentification côté serveur.

📖 Consultez `SECURE_BUILD.md` pour le guide complet.

### Création du Build de Production

Pour créer un build de production pour le déploiement web :

```bash
# Générer les données des documents et créer le build web
npm run build:web

# Alternative : Générer les documents, build et créer une archive de déploiement
npm run deploy:prepare
```

Ceci créera un dossier `dist/` contenant tous les fichiers nécessaires pour le déploiement web.

### Test du Build de Production en Local

Pour tester le build de production sur votre machine locale :

#### Option 1 : Utilisation de Python (Recommandé)
```bash
# Naviguer vers le dossier de build
cd dist

# Démarrer un serveur HTTP local (Python 3)
python -m http.server 8000

# Ou pour Python 2
python -m SimpleHTTPServer 8000
```

Puis ouvrez votre navigateur et allez sur : http://localhost:8000

#### Option 2 : Utilisation de Node.js serve
```bash
# Installer serve globalement (une seule fois)
npm install -g serve

# Servir le dossier dist
serve dist -p 8000
```

#### Option 3 : Utilisation de Live Server (Extension VSCode)
1. Installer l'extension "Live Server" dans VSCode
2. Clic droit sur `dist/index.html` → "Open with Live Server"

### Déploiement sur Votre Serveur Web

1. **Upload des fichiers** : Copier tout le contenu du dossier `dist/` dans le répertoire public de votre serveur web
2. **Configuration du serveur** : Assurez-vous que votre serveur web serve `index.html` pour toutes les routes (configuration SPA)
3. **Test** : Visitez votre domaine pour vérifier le déploiement

#### Configuration Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Configuration Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Scripts Disponibles

- `npm run build:web` - Build de l'application web pour la production
- `npm run deploy:prepare` - Build et création d'un fichier ZIP prêt pour le déploiement
- `npm run generate-docs` - Génération des données de documents à partir du CSV
- `npm run dev` - Génération des docs et démarrage du serveur de développement

## Structure du Projet

```
stephane-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Section hero et services
│   │   ├── FormationScreen.tsx    # Programmes de formation
│   │   ├── DocumentsScreen.tsx    # Documents avec intégration CSV
│   │   └── ContactScreen.tsx      # Formulaire de contact et infos
│   ├── data/
│   │   └── documents.ts           # Généré depuis CSV (auto-mis à jour)
│   └── utils/
│       └── csvLoader.ts           # Utilitaires de chargement CSV
├── assets/
│   ├── documents.csv              # Données des documents (modifiable)
│   └── README-CSV.md              # Documentation CSV
├── scripts/
│   └── generateDocuments.js       # Convertisseur CSV vers TypeScript
├── dist/                          # Sortie du build web (généré)
├── App.tsx                        # Composant principal de l'app
├── package.json
├── app.json
└── README.md
```

## Technologies Utilisées

- **React Native** : Développement mobile cross-platform
- **Expo** : Plateforme et outils de développement
- **TypeScript** : Sécurité des types et meilleure expérience de développement
- **React Navigation** : Navigation entre les écrans
- **Expo Vector Icons** : Bibliothèque d'icônes
- **React Native Safe Area Context** : Gestion des zones sécurisées
- **Gestion de Données CSV** : Chargement dynamique de documents
- **Scripts Node.js** : Automatisation du build et génération de données

## Aperçu des Fonctionnalités

### Écran d'Accueil
- Section hero avec logo professionnel et titre
- Statistiques clés (30+ années d'expérience, 305+ professionnels formés, 97% de satisfaction)
- Aperçu des services avec détails des formations
- Sections d'ateliers (Pré-désinfection, Nettoyage, Conditionnement, etc.)
- Citation professionnelle et témoignages

### Écran Formation
- Programmes de formation disponibles (URPS Normandie, PACA, Océan Indien)
- Objectifs et contenu détaillés du programme
- Informations pratiques et modalités
- Références légales et informations de conformité

### Écran Contact
- Informations de contact complètes avec éléments interactifs
- Formulaire de contact professionnel avec validation
- Villes de formation disponibles en France
- Section de rappel rapide des statistiques

### Écran Documents
- Gestion dynamique des documents via fichier CSV
- Documents catégorisés (URPS, Formation, COVID, etc.)
- Fonctionnalité de recherche et de filtrage
- Gestion des liens spécifique à la plateforme (web vs mobile)
- Icônes personnalisables (lien externe ou téléchargement)

## Gestion des Documents

L'application utilise un système basé sur CSV pour une gestion facile des documents :

### Modification des Documents

1. **Modifier le CSV** : Modifiez `assets/documents.csv` avec votre éditeur préféré
2. **Régénérer les données** : Exécutez `npm run generate-docs` pour mettre à jour l'application
3. **Tester les changements** : Utilisez `npm run dev` pour voir les mises à jour

### Format CSV

Le fichier CSV contient ces colonnes :
- `id` : Identifiant unique
- `title` : Titre du document
- `category` : Catégorie (URPS, Formation, COVID, etc.)
- `type` : Type de document (Web, PDF, etc.)
- `year` : Année de publication (optionnel)
- `description` : Description du document
- `url` : Lien direct vers le document
- `iconType` : Type d'icône (`external` ou `download`)
- `color` : Couleur de la catégorie (format hex)

Pour une documentation détaillée, voir `assets/README-CSV.md`.

## Développement

L'application est construite avec TypeScript pour une meilleure sécurité des types et une expérience de développement optimisée. Tous les écrans sont responsives et fonctionnent sur différentes tailles d'écran.

## Fonctionnalités Spécifiques aux Plateformes

- **iOS** : Effets d'ombre natifs
- **Android** : Élévation Material Design
- **Web** : Ombres CSS et design responsive

## Améliorations Futures

- Upload et gestion de documents
- Fonctionnalité de recherche avancée
- Prévisualisation de documents
- Synchronisation cloud
- Système d'authentification
- Écran de paramètres

## Licence

Ce projet est privé et propriétaire.
