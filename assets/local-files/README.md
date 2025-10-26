# 📁 Fichiers Locaux

Ce dossier contient les fichiers qui seront embarqués dans l'application et accessibles hors ligne.

## 🚀 Comment ajouter un nouveau fichier local

### 1️⃣ Placer le fichier ici
Copiez simplement votre fichier dans ce dossier `assets/local-files/`

Exemple :
```
assets/local-files/
  ├── mon_document.pdf
  ├── tableau.xlsx
  └── guide.docx
```

### 2️⃣ Générer le mapping automatique
```bash
npm run generate-local-assets
```

Ou générer tout en une fois (documents + fichiers locaux) :
```bash
npm run generate-all
```

### 3️⃣ Utiliser dans le CSV
Dans `assets/documents.csv`, utilisez le préfixe `file://` :

```csv
id,title,category,subCategory,type,year,description,url,iconType,color
99,Mon Doc,CATEGORY,SUB,PDF,,Ma description,file://mon_document.pdf,download,#FF0000
```

### 4️⃣ Régénérer les documents
```bash
npm run generate-docs
```

Ou tout regénérer en une commande :
```bash
npm run generate-all
```

## 📋 Formats supportés

- ✅ **PDF** (.pdf)
- ✅ **Excel** (.xlsx, .xls)
- ✅ **Word** (.docx, .doc)
- ✅ **PowerPoint** (.pptx, .ppt)

## 🎯 Comportement

### 📱 Sur Mobile (iOS/Android)
- Clic sur le document → Menu de partage
- L'utilisateur peut ouvrir avec l'application appropriée (Excel, Word, etc.)

### 🌐 Sur Web
- Clic sur le document → Téléchargement automatique

## ⚙️ Automatisation

Le script `scripts/generateLocalAssets.js` :
1. Scanne automatiquement ce dossier
2. Génère `src/utils/localAssets.ts` avec tous les fichiers
3. Aucune déclaration manuelle nécessaire !

## 🔄 Workflow complet

```bash
# 1. Ajouter votre fichier ici
cp mon_fichier.xlsx assets/local-files/

# 2. Tout regénérer
npm run generate-all

# 3. Démarrer l'app
npm start
```

C'est tout ! 🎉

