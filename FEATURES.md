# Features & Requirements

> **This document must be kept up to date at all times.**
> Every requirement is identified by a unique `REQ-XXX` ID.
> The related code must contain `/* [REQ-XXX] */` annotation comments.
> Never delete a deprecated requirement — mark it `[DEPRECATED]` instead.

---

## Project Overview

| Field | Value |
|---|---|
| **Project Name** | CTA Pratique |
| **Repository** | ctapratique |
| **Tech Stack** | React Native (Expo) + HTML static site |
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
- **Files**: src/screens/DocumentsScreen.tsx, html-site/index.html, html-site/css/styles.css
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
- **Files**: src/screens/DocumentsScreen.tsx, html-site/index.html, html-site/css/styles.css
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
- **Files**: src/screens/DocumentsScreen.tsx, html-site/index.html, html-site/css/styles.css
- **Components / Functions**: Suppression du bloc `{!isMobile && <logoContainer>}`, suppression du branch conditionnel `isMobile ? ... : ...` dans le header, utilisation unique de `headerMain` avec `headerLogo` inline. Styles `logoContainer` et `logoImage` supprimés. Import `useWindowDimensions` retiré.
- **Notes**: Le header utilise désormais la même disposition `headerMain` (flex row: logo + texte) sur mobile et desktop.

---
