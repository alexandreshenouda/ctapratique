# Build Sécurisé avec Mot de Passe

## 🔐 Vue d'ensemble

Le système de build sécurisé chiffre tous les fichiers JavaScript et CSS de l'application avec le chiffrement AES-256. L'accès nécessite un mot de passe qui sert de clé de déchiffrement.

## 🎯 Caractéristiques

- **Chiffrement AES-256** : Tous les fichiers JS et CSS sont chiffrés
- **Page de login** : Interface utilisateur pour entrer le mot de passe
- **Vérification sécurisée** : Le mot de passe est haché (SHA-256) et n'est jamais stocké en clair
- **Déchiffrement dynamique** : Les fichiers sont déchiffrés en mémoire dans le navigateur
- **Protection de session** : Le mot de passe est stocké dans sessionStorage (effacé à la fermeture de l'onglet)

## 🚀 Utilisation

### Générer un build sécurisé

```bash
npm run build:web:secure
```

Cette commande :
1. Génère le build web classique
2. Chiffre tous les fichiers JS et CSS
3. Crée une page de login (`index.html`)
4. Crée une page d'application chiffrée (`app.html`)

### Préparer pour le déploiement

```bash
npm run deploy:prepare:secure
```

Cette commande génère un build sécurisé et crée une archive ZIP prête pour le déploiement.

### Tester localement

```bash
npm run build:web:secure
npm run serve:web
```

Puis ouvrez http://localhost:3000 dans votre navigateur.

## 🔑 Mot de passe

**Mot de passe actuel** : `CTP2026`

### Modifier le mot de passe

1. Ouvrez `scripts/encryptBuild.js`
2. Modifiez la ligne :
   ```javascript
   const PASSWORD = 'CTP2026';
   ```
3. Régénérez le build sécurisé

## 📁 Structure du build sécurisé

```
dist/
├── index.html              # Page de login (point d'entrée)
├── app.html                # Page de l'application (chiffrée)
├── assets/
│   └── logo.jpg           # Assets non chiffrés
└── _expo/
    └── static/
        ├── js/
        │   └── *.encrypted # Fichiers JS chiffrés
        └── css/
            └── *.encrypted # Fichiers CSS chiffrés
```

## 🔒 Sécurité

### Points forts
- Le mot de passe n'est jamais stocké en clair dans le code
- Le contenu est réellement chiffré avec AES-256
- Le mot de passe est haché avec SHA-256 pour la vérification
- Protection efficace contre les utilisateurs occasionnels

### Limitations importantes
⚠️ **Ce système est une protection "soft"** :
- Le code de déchiffrement est présent dans le navigateur
- Un utilisateur avec des compétences techniques avancées pourrait contourner la protection
- Le JavaScript peut toujours être inspecté et modifié
- Cette solution est idéale pour protéger contre l'accès casual, mais pas contre une attaque déterminée

### Recommandations
Pour une sécurité maximale, envisagez :
- Une authentification côté serveur
- Un backend avec contrôle d'accès
- Des tokens JWT pour les sessions
- Rate limiting pour prévenir les attaques par force brute

## 🧪 Fonctionnement technique

### 1. Phase de chiffrement (scripts/encryptBuild.js)
```javascript
// Chiffrement AES avec le mot de passe
const encrypted = CryptoJS.AES.encrypt(content, PASSWORD).toString();
```

### 2. Page de login (index.html)
- Demande le mot de passe à l'utilisateur
- Vérifie le hash SHA-256 du mot de passe entré
- Stocke le mot de passe en sessionStorage si correct
- Redirige vers app.html

### 3. Page de l'application (app.html)
- Vérifie la présence du mot de passe en sessionStorage
- Déchiffre tous les fichiers JS/CSS avec le mot de passe
- Injecte le code déchiffré dans le DOM
- Lance l'application React

### 4. Déchiffrement
```javascript
// Déchiffrement AES avec le mot de passe de la session
const decrypted = CryptoJS.AES.decrypt(encryptedContent, appKey)
                             .toString(CryptoJS.enc.Utf8);
```

## 🚨 Dépannage

### Le mot de passe ne fonctionne pas
- Vérifiez que vous utilisez le bon mot de passe : `CTP2026`
- Videz le cache du navigateur
- Régénérez le build sécurisé

### Erreur "Déchiffrement échoué"
- Le build a peut-être été généré avec un mot de passe différent
- Régénérez le build avec `npm run build:web:secure`

### Page blanche après login
- Ouvrez la console développeur (F12) pour voir les erreurs
- Vérifiez que tous les fichiers .encrypted sont présents
- Essayez de vider le cache et sessionStorage

## 📝 Notes de déploiement

### GitHub Pages
- Le build sécurisé fonctionne parfaitement avec GitHub Pages
- Déployez simplement le contenu du dossier `dist/`
- Le workflow GitHub Actions peut être modifié pour utiliser le build sécurisé

### Autres hébergeurs
- Compatible avec tout hébergeur de fichiers statiques
- Aucune configuration serveur requise
- Fonctionne en HTTPS et HTTP

## 🔄 Workflow de déploiement

### Déploiement manuel

Pour mettre à jour l'application déployée avec la version sécurisée :

```bash
# 1. Générer le build sécurisé
npm run build:web:secure

# 2. Tester localement
npm run serve:web

# 3. Déployer avec gh-pages
npx gh-pages -d dist
```

### Déploiement automatique avec GitHub Actions

Le projet inclut deux workflows GitHub Actions :

#### 1. Déploiement normal (`deploy.yml`)
- Se déclenche automatiquement à chaque push sur `main`
- Déploie la version non sécurisée

#### 2. Déploiement sécurisé (`deploy-secure.yml`)
- **Déclenchement manuel** : 
  1. Allez sur GitHub → Actions
  2. Sélectionnez "Deploy Secure Build to GitHub Pages"
  3. Cliquez sur "Run workflow"
  
- **Ou par push sur la branche `secure-deploy`** :
  ```bash
  git checkout -b secure-deploy
  git push origin secure-deploy
  ```

Pour changer le workflow par défaut et toujours déployer la version sécurisée :
1. Modifiez `.github/workflows/deploy.yml`
2. Changez la ligne 27 de `npm run build:web` à `npm run build:web:secure`
3. Commitez et pushez

## 📚 Ressources

- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/)
- [AES Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [SHA-256 Hashing](https://en.wikipedia.org/wiki/SHA-2)

