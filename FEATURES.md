# Features & Requirements

> **This document must be kept up to date at all times.**
> Every requirement is identified by a unique `REQ-XXX` ID.
> The related code must contain `// [REQ-XXX]` annotation comments.
> Never delete a deprecated requirement — mark it `[DEPRECATED]` instead.

---

## Project Overview

| Field | Value |
|---|---|
| **Project Name** | CTA Pratique |
| **Repository** | ctapratique |
| **Tech Stack** | React Native (Expo SDK 54) — Web, iOS, Android — TypeScript, React Navigation (Bottom Tabs), Firebase Cloud Messaging, Web3Forms |
| **Last Updated** | 2026-03-27 |

---

## Requirements

### REQ-001 — Inverser la barre de recherche et la zone d'annonces

**Status**: `Done`
**Priority**: High

**Description**:
Sur l'écran Documents, la barre de recherche et la zone d'annonces (ANNOUNCEMENTS) doivent être inversées : la recherche passe au-dessus des annonces. Les annonces défilent avec le contenu.

**Acceptance Criteria**:
- [x] La barre de recherche est affichée avant les annonces
- [x] Les annonces défilent avec le contenu (dans le ScrollView)
- [x] L'ordre est : Header(logo+titre) → Recherche → [ScrollView: Annonces → Catégories → Documents]

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx
- **Components / Functions**: `searchContainer` placé avant `ScrollView`, `announcementsContainer` déplacé dans `ScrollView`
- **Notes**: La barre de recherche est maintenant un élément fixe (hors ScrollView). Les annonces défilent avec le contenu.

---

### REQ-002 — Header (logo+titre) et barre de recherche fixes pendant le défilement

**Status**: `Done`
**Priority**: High

**Description**:
Le header (logo + titre) et la barre de recherche doivent rester fixes en haut de l'écran lorsque l'utilisateur fait défiler le contenu. Les annonces, catégories et documents défilent dans le ScrollView.

**Acceptance Criteria**:
- [x] Le header et la barre de recherche restent visibles en haut lors du scroll
- [x] Annonces, catégories et documents défilent sous le bloc fixe
- [x] Pas de chevauchement visuel

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx
- **Components / Functions**: Header et `searchContainer` placés avant `ScrollView` dans le JSX
- **Notes**: Dans React Native, les éléments hors du ScrollView restent naturellement fixes. Pas besoin de `position: sticky`.

---

### REQ-003 — Intégrer le logo avec le titre (pas d'affichage séparé sur desktop)

**Status**: `Done`
**Priority**: High

**Description**:
Sur desktop, le logo ne doit plus être affiché dans un conteneur séparé au-dessus du titre. Il doit utiliser la même disposition inline (logo à côté du titre) que sur mobile.

**Acceptance Criteria**:
- [x] Le logo est affiché à côté (inline) du titre sur toutes les tailles d'écran
- [x] Le conteneur `logoContainer` séparé (desktop) est supprimé
- [x] La disposition est cohérente mobile/desktop

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx
- **Components / Functions**: Suppression du bloc `{!isMobile && <logoContainer>}`, suppression du branch conditionnel `isMobile ? ... : ...` dans le header, utilisation unique de `headerMain` avec `headerLogo` inline. Styles `logoContainer` et `logoImage` supprimés. Import `useWindowDimensions` retiré.
- **Notes**: Le header utilise désormais la même disposition `headerMain` (flex row: logo + texte) sur mobile et desktop.

---

### REQ-004 — Navigation par onglets (Bottom Tab Navigator)

**Status**: `Done`
**Priority**: High

**Description**:
L'application utilise une navigation par onglets en bas d'écran (Bottom Tab Navigator) avec des icônes Ionicons colorées selon le thème médical. Quatre onglets sont définis : Accueil, Formation, Documents et Contact. Actuellement seuls Documents et Contact sont activés ; Accueil et Formation sont commentés dans le code.

**Acceptance Criteria**:
- [x] Bottom Tab Navigator affiché en bas de chaque écran
- [x] Icônes Ionicons (filled quand sélectionné, outline sinon)
- [x] Couleurs actif/inactif liées au thème médical (`MedicalTheme.primary` / `MedicalTheme.textSecondary`)
- [x] Onglets Documents et Contact visibles et fonctionnels
- [x] Onglets Accueil et Formation désactivés (commentés dans le code)
- [x] En-tête natif masqué (`headerShown: false`)

**Implementation**:
- **Files**: App.tsx
- **Components / Functions**: `Tab.Navigator` (react-navigation/bottom-tabs), `Tab.Screen` pour chaque onglet, `screenOptions` avec `tabBarIcon`
- **Notes**: Les écrans HomeScreen et FormationScreen existent mais sont commentés dans le Navigator. Les 4 fichiers écran sont importés.

---

### REQ-005 — Thème médical centralisé (MedicalTheme)

**Status**: `Done`
**Priority**: Medium

**Description**:
Un fichier de thème centralisé définit la palette de couleurs de l'application, inspirée du domaine médical (bleu médical, vert hygiène, cyan stérilisation, etc.). Ce thème est utilisé dans tous les écrans.

**Acceptance Criteria**:
- [x] Palette de couleurs complète : primary, secondary, success, warning, error, info
- [x] Couleurs spécialisées par domaine médical (stérilisation, hygiène, sécurité, formation, certification)
- [x] Couleurs par catégorie de documents (`CategoryColors`)
- [x] Couleurs neutres : background, surface, textes, bordures
- [x] Couleurs de statut (active, inactive, pending, completed)
- [x] Utilisé comme import par défaut dans tous les écrans

**Implementation**:
- **Files**: src/theme/colors.ts
- **Components / Functions**: `MedicalTheme` (export par défaut), `CategoryColors` (export nommé)
- **Notes**: Primary est `#2E86AB` (bleu médical). Sous-objet `medical` pour couleurs domaine. Sous-objet `status` pour états.

---

### REQ-006 — Pipeline de données CSV → TypeScript pour les documents

**Status**: `Done`
**Priority**: High

**Description**:
Les documents sont définis dans un fichier CSV (`assets/documents.csv`) et convertis automatiquement en un fichier TypeScript (`src/data/documents.ts`) via un script Node.js. Le fichier généré embarque les données CSV dans une constante string et fournit une fonction de parsing.

**Acceptance Criteria**:
- [x] Le fichier CSV contient les colonnes : id, title, category, subCategory, type, year, description, url, iconType, color
- [x] Le script `generateDocuments.js` lit le CSV et génère le fichier TypeScript
- [x] Le fichier TypeScript exporte `DocumentData` (interface), `csvData` (string), et `loadDocuments()` (function)
- [x] Le parsing gère les champs entre guillemets (virgules dans les valeurs)
- [x] La commande `npm run generate-docs` exécute le script

**Implementation**:
- **Files**: assets/documents.csv, scripts/generateDocuments.js, src/data/documents.ts (auto-généré)
- **Components / Functions**: `parseCSV()`, `loadDocuments()`, interface `DocumentData`
- **Notes**: Le fichier `documents.ts` ne doit pas être modifié manuellement. Plus de 50 documents référencés couvrant catégories: SYNTHÈSE, RÉSERVATION URPS, FORMATION BELGIQUE, LOCAUX HYGIENE PROTECTION, DISPOSITIFS MEDICAUX, DASRI AIR EAU, PROTOCOLES, GUIDES OFFICIELS, ARTICLES, A.R.S DGCCRF, VIDEOS, ECO-RESPONSABLE, CONSOMMABLES.

---

### REQ-007 — Écran Documents — Bibliothèque documentaire

**Status**: `Done`
**Priority**: High

**Description**:
L'écran principal affiche la bibliothèque de documents organisée en catégories. Il comprend un header avec logo et titre, une barre de recherche fixe, une zone d'annonces, des filtres par catégorie et la liste de documents. L'affichage est adaptée web (grille wrappée pour les catégories) et mobile (défilement horizontal).

**Acceptance Criteria**:
- [x] Header avec logo (`logo.jpg`) inline et titre « Référentiels & Fiches pratiques »
- [x] Sous-titre « Hygiène, Stérilisation et Asepsie Dentaire »
- [x] Zone de catégories avec cartes (icône, titre, nombre de documents)
- [x] Liste de documents avec icône type (PDF, vidéo, web, PPT), titre, description, année, badge type
- [x] Icône d'action : `open-outline` (lien externe) ou `download-outline` (téléchargement)
- [x] État vide avec message et icône quand aucun document trouvé
- [x] SafeAreaView englobante

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx, src/utils/csvLoader.ts
- **Components / Functions**: `DocumentsScreen`, `CategoryCard`, `DocumentComponent`, `DocumentOrGroupItem`
- **Notes**: Les catégories sont générées dynamiquement à partir des données documents via `getCategoryInfoList()`. Sur web, les catégories sont en grille wrappée avec max-height scrollable ; sur mobile, défilement horizontal.

---

### REQ-008 — Navigation hiérarchique par catégories et sous-catégories

**Status**: `Done`
**Priority**: High

**Description**:
La bibliothèque de documents propose une navigation hiérarchique : Toutes les catégories → Catégorie → Sous-catégories → Documents. Chaque niveau est accessible avec un bouton retour dans le header. Les documents peuvent être regroupés par ID (quand plusieurs entrées partagent le même identifiant).

**Acceptance Criteria**:
- [x] Vue principale : liste des catégories avec nombre de documents
- [x] Clic sur une catégorie → affiche les sous-catégories
- [x] Clic sur une sous-catégorie → affiche les documents de cette sous-catégorie
- [x] Documents avec le même ID regroupés en « groupe » (affichage `X documents disponibles`)
- [x] Clic sur un groupe → affiche les documents individuels du groupe
- [x] Bouton retour (flèche) dans le header à chaque niveau de profondeur
- [x] Le header affiche le nom du niveau courant et un sous-titre contextuel

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx, src/utils/csvLoader.ts
- **Components / Functions**: `loadCategories()`, `loadDocumentsBySubCategory()`, `handleCategoryPress()`, `handleSubCategoryPress()`, `handleGroupPress()`, `handleBackFromGroup()`, `handleBackFromSubCategory()`, `handleBackFromCategoryView()`. Types : `CategoryGroup`, `SubCategoryGroup`, `DocumentGroup`, `DocumentItem`
- **Notes**: La navigation est gérée par état local (`selectedCategoryForSubCat`, `selectedSubCategory`, `selectedGroup`). Une transition de chargement (`isGroupTransitioning`) est affichée entre les niveaux.

---

### REQ-009 — Recherche documentaire avec regroupement par catégorie

**Status**: `Done`
**Priority**: High

**Description**:
La barre de recherche filtre les documents par titre et description. Quand on est sur la vue « Tous », les résultats sont regroupés par catégorie avec des en-têtes visuels non-cliquables. Quand on est dans une catégorie, la recherche filtre les sous-catégories et documents de cette catégorie.

**Acceptance Criteria**:
- [x] Recherche en temps réel (filtrage au fur et à mesure de la saisie)
- [x] Filtrage sur le titre et la description des documents
- [x] En vue « Tous » : résultats groupés par catégorie avec en-tête visuel (fond gris, bordure gauche bleue)
- [x] En vue catégorie : filtrage des sous-catégories qui contiennent des documents correspondants
- [x] Bouton d'effacement (X) quand le champ n'est pas vide
- [x] Placeholder : « Cliquez sur TOUS avant la recherche... »

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx
- **Components / Functions**: `searchQuery` (state), `getGroupedDocumentsByCategory()`, composant `searchHeaderItem` (style non-cliquable)
- **Notes**: Les en-têtes de recherche utilisent un ID préfixé `search-header-` pour les identifier et empêcher le clic.

---

### REQ-010 — Bandeau d'annonces configurable

**Status**: `Done`
**Priority**: Medium

**Description**:
Un bandeau d'informations configurable est affiché en haut du contenu scrollable de l'écran Documents. Les annonces sont définies dans un tableau constant dans le code. Laisser le tableau vide masque la section.

**Acceptance Criteria**:
- [x] Les annonces sont définies dans la constante `ANNOUNCEMENTS` (tableau de strings)
- [x] Chaque annonce est affichée avec une icône `information-circle` bleue
- [x] Le bandeau a un fond bleu clair (`#EAF4FE`) avec bordure basse
- [x] Le bandeau est masqué si le tableau est vide
- [x] Le bandeau défile avec le contenu (dans le ScrollView)

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx
- **Components / Functions**: Constante `ANNOUNCEMENTS`, bloc JSX `announcementsContainer` dans le `ScrollView`
- **Notes**: Actuellement une annonce fait référence au guide ADF 2026. Pour ajouter une annonce, il suffit d'ajouter un string au tableau.

---

### REQ-011 — Ouverture de documents (liens externes, téléchargement, fichiers locaux)

**Status**: `Done`
**Priority**: High

**Description**:
L'ouverture d'un document dépend de son type (`iconType`) et de son URL. Les liens externes s'ouvrent dans un nouvel onglet (web) ou via `Linking` (mobile). Les fichiers locaux (`file://`) sont téléchargés (web) ou partagés via le système natif (mobile). Sur mobile, une modale Alert affiche les détails avant ouverture.

**Acceptance Criteria**:
- [x] Liens externes (`iconType: 'external'`) : ouverture dans un nouvel onglet/navigateur
- [x] Liens de téléchargement (`iconType: 'download'`) : ouverture dans un nouvel onglet/navigateur
- [x] Fichiers locaux (`file://…`) : téléchargement direct sur web, partage natif sur mobile
- [x] Sur web : `window.open(url, '_blank')` directement
- [x] Sur mobile : Alert avec titre, description, type, année, puis bouton d'action
- [x] Gestion d'erreurs avec Alert en cas d'échec

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx, src/utils/localAssets.ts
- **Components / Functions**: `handleDocumentPress()`, `isLocalFile()`, `openLocalFile()`
- **Notes**: Le texte de l'action change selon le type : « Accéder au lien » (external) ou « Télécharger » (download).

---

### REQ-012 — Système de fichiers locaux (assets locaux)

**Status**: `Done`
**Priority**: Medium

**Description**:
Certains documents (XLSX, DOCX) sont embarqués dans l'application via `assets/local-files/`. Un script Node.js génère automatiquement le mapping TypeScript des fichiers vers leurs `require()` Expo. Sur web, le fichier est téléchargé via un lien dynamique ; sur mobile, il est partagé via `expo-sharing`.

**Acceptance Criteria**:
- [x] Les fichiers placés dans `assets/local-files/` sont automatiquement inclus au build
- [x] Le script `generateLocalAssets.js` génère `src/utils/localAssets.ts` avec le mapping `require()`
- [x] Les URL `file://nom-du-fichier.ext` dans le CSV déclenchent l'ouverture locale
- [x] Sur web : téléchargement via `document.createElement('a')` + `asset.downloadAsync()`
- [x] Sur mobile : partage via `expo-sharing` ou copie vers `documentDirectory` puis partage
- [x] La commande `npm run generate-local-assets` exécute le script

**Implementation**:
- **Files**: scripts/generateLocalAssets.js, src/utils/localAssets.ts (auto-généré), assets/local-files/
- **Components / Functions**: `isLocalFile()`, `getLocalFileName()`, `openLocalFile()`, `downloadFileWeb()`, `shareFileNative()`, constante `LOCAL_ASSETS`
- **Notes**: Actuellement 3 fichiers locaux : F_trac_entr_C240917_V2.0.xlsx, Tableur_check_list_Gestion_DAS_VF.xlsx, f_fich_ster_S240917_v2.0.docx.

---

### REQ-013 — Écran Contact — Carte de profil

**Status**: `Done`
**Priority**: Medium

**Description**:
L'écran Contact affiche une carte de profil du formateur (Stéphane SANANÈS) avec sa photo, son nom, ses titres professionnels et diplômes universitaires. Un logo est affiché au-dessus du header.

**Acceptance Criteria**:
- [x] Photo de profil ronde (`photo_contact.jpeg`) avec bordure bleu médical
- [x] Nom en gras de couleur primaire
- [x] Séparateur visuel sous le nom
- [x] Détails professionnels avec icônes (medkit, search, school) : formateur, consultant audit, diplômes
- [x] Logo de l'application au-dessus du header
- [x] Header avec titre « Nous Contacter » et sous-titre

**Implementation**:
- **Files**: src/screens/ContactScreen.tsx
- **Components / Functions**: `ContactScreen`, bloc `profileCard`, images `logo.jpg` et `photo_contact.jpeg`
- **Notes**: La carte de profil est centrée avec ombre portée. Les détails sont en flex row (icône + texte).

---

### REQ-014 — Écran Contact — Méthodes de contact (email, téléphone, site web)

**Status**: `Done`
**Priority**: Medium

**Description**:
Sous la carte de profil, une section affiche les méthodes de contact cliquables : email, téléphone et site web. Chaque méthode ouvre l'action appropriée selon la plateforme.

**Acceptance Criteria**:
- [x] Email (`contact@ctapratique.com`) → ouvre le client mail via `mailto:`
- [x] Téléphone (`06.73.84.77.66`) → compose le numéro via `tel:`
- [x] Site web (`www.ctapratique.fr`) → ouvre dans un nouvel onglet (web) ou navigateur (mobile)
- [x] Chaque méthode affichée sous forme de carte avec icône, label et valeur
- [x] Chevron indicateur d'action sur chaque carte

**Implementation**:
- **Files**: src/screens/ContactScreen.tsx
- **Components / Functions**: `ContactInfo` (composant), `handleEmailPress()`, `handlePhonePress()`, tableau `contactMethods`
- **Notes**: Sur web, `window.open(url, '_self')` pour email/téléphone, `_blank` pour le site. Sur mobile, `Linking.canOpenURL()` + `Linking.openURL()`.

---

### REQ-015 — Écran Contact — Formulaire de contact (Web3Forms)

**Status**: `Done`
**Priority**: High

**Description**:
Un formulaire de contact permet aux visiteurs d'envoyer un message. Les données sont envoyées via l'API Web3Forms (service tiers CORS-compatible). Le formulaire comprend des champs nom, email, téléphone, adresse, ville, objet et message.

**Acceptance Criteria**:
- [x] Champs obligatoires : Nom, Email, Message (marqués avec *)
- [x] Champs optionnels : Téléphone, Adresse, Ville, Objet
- [x] Validation email par regex avant envoi
- [x] Envoi via `fetch` POST vers `https://api.web3forms.com/submit` avec `FormData`
- [x] État de chargement pendant l'envoi (spinner + texte « Envoi en cours... »)
- [x] Formulaire réinitialisé après envoi réussi
- [x] Bannière de succès animée (fade in → 3s pause → fade out) sur web
- [x] Alert de succès sur mobile
- [x] Message d'erreur si envoi échoue
- [x] Alerte si la clé Web3Forms n'est pas configurée

**Implementation**:
- **Files**: src/screens/ContactScreen.tsx, src/config/contact.config.ts
- **Components / Functions**: `handleSubmit()`, `handleInputChange()`, state `form`, `isSending`, `showSuccessMessage`, `successOpacity` (Animated.Value)
- **Notes**: La clé d'accès Web3Forms est stockée dans `contact.config.ts`. L'animation utilise `Animated.sequence` avec `Animated.timing` et `Animated.delay`.

---

### REQ-016 — Notifications push web (Firebase Cloud Messaging)

**Status**: `Done`
**Priority**: Medium

**Description**:
L'application supporte les notifications push sur navigateur web via Firebase Cloud Messaging (FCM). Au démarrage, elle demande la permission de notification, enregistre le token FCM dans Firestore, et écoute les messages au premier plan. Un service worker gère les notifications en arrière-plan.

**Acceptance Criteria**:
- [x] Initialisation automatique au démarrage de l'app (`initNotifications()`)
- [x] Demande de permission via `Notification.requestPermission()`
- [x] Enregistrement du service worker `firebase-messaging-sw.js`
- [x] Récupération du token FCM via `getToken()` avec clé VAPID
- [x] Token sauvegardé automatiquement dans Firestore (collection `fcm_tokens`, ID = hash SHA-256 du token)
- [x] Écoute des messages au premier plan → affiche `new Notification()`
- [x] Service worker : gestion `onBackgroundMessage` et `notificationclick`
- [x] Ne fait rien si `Platform.OS !== 'web'` ou si Firebase non configuré
- [x] Non bloquant : les erreurs sont loguées mais n'empêchent pas le fonctionnement de l'app

**Implementation**:
- **Files**: src/utils/notifications.ts, src/config/firebase.config.ts, public/firebase-messaging-sw.js, App.tsx
- **Components / Functions**: `initNotifications()`, `requestNotificationPermission()`, `listenForForegroundMessages()`, `saveTokenToFirestore()`, `getMessagingInstance()`
- **Notes**: La config Firebase est dans un fichier séparé. Le service worker utilise les SDK compat Firebase. Le token Firestore utilise un hash SHA-256 comme ID de document pour éviter les doublons.

---

### REQ-017 — Pipeline de build web (chemins relatifs, chiffrement, PWA)

**Status**: `Done`
**Priority**: Medium

**Description**:
Le build web comprend plusieurs étapes post-traitement : correction des chemins absolus en relatifs pour GitHub Pages, chiffrement optionnel des assets JS/CSS avec une page de login par mot de passe, génération d'un manifest PWA, et injection de la config Firebase dans le service worker.

**Acceptance Criteria**:
- [x] `fixWebPaths.js` : remplace les chemins `/_expo/`, `/assets/`, etc. par des chemins relatifs `./`
- [x] `fixWebPaths.js` : crée un fichier `.nojekyll` pour GitHub Pages
- [x] `encryptBuild.js` : chiffre tous les fichiers JS et CSS avec AES (mot de passe CTP2026)
- [x] `encryptBuild.js` : préserve le service worker Firebase (non chiffré)
- [x] `encryptBuild.js` : génère une page de login HTML avec déchiffrement côté client
- [x] `encryptBuild.js` : crée un `manifest.json` PWA avec icônes et couleurs de thème
- [x] `encryptBuild.js` : injecte la config Firebase dans le service worker
- [x] Commandes NPM : `build:web`, `build:web:secure`, `serve:web`, `deploy:prepare`

**Implementation**:
- **Files**: scripts/fixWebPaths.js, scripts/encryptBuild.js, package.json (scripts)
- **Components / Functions**: `fixPathsInFile()`, `fixAllPaths()`, `encryptFile()`, `processDirectory()`, `createLoginPage()`, `createManifestAndIcons()`
- **Notes**: Le build sécurisé utilise CryptoJS côté client pour déchiffrer à la volée. Le mot de passe est vérifié par hash SHA-256 avant déchiffrement. Commande complète : `npm run generate-all && npx expo export --platform web && node scripts/fixWebPaths.js`.

---

### REQ-018 — Écran Accueil (désactivé)

**Status**: `Done`
**Priority**: Low

**Description**:
Un écran d'accueil existe avec une section hero (logo + titre), des statistiques (30 ans d'expérience, 305 dentistes formés, 97% satisfaction, 9 villes), des cartes de services/formations, une grille d'ateliers (pré-désinfection, nettoyage, conditionnement, stérilisation, traçabilité) et une citation inspirante. Cet écran est actuellement désactivé (commenté dans App.tsx).

**Acceptance Criteria**:
- [x] Section hero avec logo et titre « Formateur en Hygiène & Stérilisation Dentaire »
- [x] Grille de statistiques (4 cartes avec icônes et chiffres)
- [x] Section formations (3 cartes de services)
- [x] Grille d'ateliers (5 éléments)
- [x] Section citation
- [ ] Onglet Accueil visible dans la navigation (actuellement commenté)

**Implementation**:
- **Files**: src/screens/HomeScreen.tsx, App.tsx (ligne commentée)
- **Components / Functions**: `HomeScreen`, sections : `heroSection`, `statsSection`, `section` (services), `workshopsGrid`, `quoteSection`
- **Notes**: L'écran est fonctionnel mais désactivé dans la navigation. Le Tab.Screen Accueil est commenté dans App.tsx.

---

### REQ-019 — Écran Formation (désactivé)

**Status**: `Done`
**Priority**: Low

**Description**:
Un écran Formation existe avec la liste des formations disponibles (URPS Normandie, PACA, Océan Indien), les objectifs pédagogiques, le programme détaillé, les informations pratiques (modalités, nombre de participants, ateliers) et les références légales. Cet écran est actuellement désactivé (commenté dans App.tsx).

**Acceptance Criteria**:
- [x] Liste de 3 formations avec titre, description, durée et nombre de participants
- [x] Section objectifs avec 3 items (icône + titre + description)
- [x] Programme détaillé avec 8 points listés
- [x] Informations pratiques (4 modalités)
- [x] Références légales (texte réglementaire)
- [ ] Onglet Formation visible dans la navigation (actuellement commenté)

**Implementation**:
- **Files**: src/screens/FormationScreen.tsx, App.tsx (ligne commentée)
- **Components / Functions**: `FormationScreen`, `FormationItem`, tableaux `formations`, `programPoints`, `objectives`
- **Notes**: L'écran est fonctionnel mais désactivé dans la navigation. Le Tab.Screen Formation est commenté dans App.tsx.

---

### REQ-020 — Adaptations multi-plateformes (web, iOS, Android)

**Status**: `Done`
**Priority**: Medium

**Description**:
L'application adapte son comportement et ses styles selon la plateforme (web, iOS, Android) via `Platform.select` et des conditions `Platform.OS`. Les ombres, les interactions (Alert vs ouverture directe), et la disposition des éléments varient selon la cible.

**Acceptance Criteria**:
- [x] Ombres : `shadowColor/shadowOffset` sur iOS, `elevation` sur Android, `boxShadow` sur web
- [x] Liens : `window.open()` sur web, `Linking.openURL()` sur mobile
- [x] Modale Alert pour les documents sur mobile ; ouverture directe sur web
- [x] Catégories en grille wrappée sur web, défilement horizontal sur mobile
- [x] Section contact avec `maxWidth: 800` et padding horizontal élargi sur web
- [x] `SafeAreaView` sur chaque écran
- [x] Notifications push uniquement sur web (pas de traitement sur mobile)

**Implementation**:
- **Files**: src/screens/DocumentsScreen.tsx, src/screens/ContactScreen.tsx, src/screens/HomeScreen.tsx, src/screens/FormationScreen.tsx, src/utils/notifications.ts, src/utils/localAssets.ts
- **Components / Functions**: `Platform.select({...})`, `Platform.OS === 'web'`, `SafeAreaView`
- **Notes**: L'application cible principalement le web tout en étant compatible mobile. Les styles utilisent `Platform.select` avec 3 branches (ios, android, web/default).

---
