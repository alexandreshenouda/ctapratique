# Déploiement sur GitHub Pages

Guide complet pour déployer l'application sur GitHub Pages.

## Étape 1 : Construire l'application

```bash
npm run build:web
```

Ceci va :
1. Générer les données des documents depuis le CSV
2. Créer le build web optimisé dans le dossier `dist/`
3. Corriger automatiquement les chemins pour GitHub Pages
4. Créer le fichier `.nojekyll` nécessaire

## Étape 2 : Configuration GitHub Pages

### Option A : Déploiement avec gh-pages (recommandé)

1. **Installer gh-pages** :
```bash
npm install --save-dev gh-pages
```

2. **Ajouter le script de déploiement** dans `package.json` :
```json
"scripts": {
  "deploy": "npm run build:web && npx gh-pages -d dist"
}
```

3. **Déployer** :
```bash
npm run deploy
```

4. **Activer GitHub Pages** :
   - Allez sur votre repo GitHub
   - Settings > Pages
   - Source : `gh-pages` branch
   - Cliquez sur Save

Votre site sera disponible sur : `https://username.github.io/repo-name/`

### Option B : Déploiement manuel

1. **Créer une branche gh-pages** :
```bash
git checkout --orphan gh-pages
```

2. **Supprimer tous les fichiers** (sauf dist) :
```bash
git rm -rf .
```

3. **Copier le contenu de dist** :
```bash
Copy-Item -Path dist\* -Destination . -Recurse -Force
```

4. **Commit et push** :
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

5. **Activer GitHub Pages** :
   - Settings > Pages
   - Source : `gh-pages` branch
   - Save

## Étape 3 : Vérifier le déploiement

Attendez quelques minutes et visitez : `https://username.github.io/repo-name/`

## Utilisation d'un domaine personnalisé

Si vous avez un domaine personnalisé :

1. **Créer un fichier CNAME** dans le dossier `dist/` :
```
votredomaine.com
```

2. **Configurer votre DNS** :
   - Type A pointant vers les IPs GitHub :
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Ou CNAME pointant vers : `username.github.io`

3. **Activer dans GitHub** :
   - Settings > Pages > Custom domain
   - Entrez votre domaine
   - Cochez "Enforce HTTPS"

## Automatisation avec GitHub Actions

Pour déployer automatiquement à chaque push sur main :

1. **Créer `.github/workflows/deploy.yml`** :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    # Permissions nécessaires pour déployer sur GitHub Pages
    permissions:
      contents: write
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build:web
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. **Activer les permissions GitHub Actions** (si nécessaire) :
   - Allez dans Settings > Actions > General
   - Scroll jusqu'à "Workflow permissions"
   - Sélectionnez "Read and write permissions"
   - Sauvegardez

3. **Commit et push** le fichier workflow

4. À chaque push sur `main`, votre site sera automatiquement déployé !

## Dépannage

### Erreur 403 - Permission denied (GitHub Actions)

Si vous obtenez `Permission denied to github-actions[bot]` :

1. **Vérifiez les permissions dans le workflow** :
   - Le fichier `.github/workflows/deploy.yml` doit contenir :
   ```yaml
   permissions:
     contents: write
   ```

2. **Activez les permissions dans le repo** :
   - Allez dans Settings > Actions > General
   - Scroll jusqu'à "Workflow permissions"
   - Sélectionnez "Read and write permissions"
   - Cliquez sur Save

3. **Relancez le workflow** :
   - Allez dans l'onglet Actions
   - Sélectionnez le workflow échoué
   - Cliquez sur "Re-run jobs"

### Erreur 404 sur les fichiers

✅ **Déjà corrigé** : Le script `fixWebPaths.js` corrige automatiquement les chemins

### Dossiers _expo non accessibles

✅ **Déjà corrigé** : Le fichier `.nojekyll` est créé automatiquement

### Le site ne s'affiche pas

Vérifiez :
1. GitHub Pages est activé (Settings > Pages)
2. La source est bien la branche `gh-pages`
3. Attendez 2-3 minutes après le déploiement
4. Videz le cache du navigateur (Ctrl+Shift+R)

### Images ou assets manquants

Assurez-vous que tous les assets sont dans le dossier `assets/` et que le build a bien copié tout le dossier.

## Mise à jour du site

Pour mettre à jour le site après des modifications :

```bash
# Avec gh-pages (Option A)
npm run deploy

# Ou manuellement (Option B)
npm run build:web
git checkout gh-pages
Copy-Item -Path dist\* -Destination . -Recurse -Force
git add .
git commit -m "Update site"
git push origin gh-pages
git checkout main
```

## Vérifier avant de déployer

Test local du build de production :

```bash
npm run build:web
npm run serve:web
```

Ouvrez http://localhost:3000 et testez toutes les fonctionnalités.

## URLs importantes

- **Repo** : https://github.com/username/repo-name
- **GitHub Pages** : https://username.github.io/repo-name/
- **Settings** : https://github.com/username/repo-name/settings/pages

## Notes

- Le formulaire de contact fonctionne en production (CORS OK)
- Les assets sont optimisés automatiquement
- Le site est statique (pas de backend nécessaire)
- Gratuit et illimité sur GitHub Pages

