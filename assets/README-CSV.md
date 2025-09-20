# Guide d'utilisation du fichier CSV Documents

## Format du fichier `documents.csv`

Le fichier CSV contient les colonnes suivantes :

| Colonne | Description | Valeurs possibles |
|---------|-------------|-------------------|
| `id` | Identifiant unique | Numéro ou texte unique |
| `title` | Titre du document | Texte libre |
| `category` | Catégorie du document | URPS, COVID, Guides, Certifications, Congrès, Articles, Fiches, Surveillance, Spécialisations, Déchets, Contrôles, Réglementation, International, Médias, Partenaires |
| `type` | Type de fichier | PDF, Video, PPT, etc. |
| `year` | Année (optionnel) | Laisser vide ou 4 chiffres |
| `description` | Description détaillée | Texte libre |
| `url` | Lien vers le document | URL complète |
| `iconType` | Type d'icône d'action | `external` ou `download` |
| `color` | Couleur de la catégorie | Code couleur hex (#FF6B6B) |

## Types d'icônes

### `iconType: external`
- **Icône affichée**: Flèche sortante (open-outline)
- **Action**: "Accéder au lien"
- **Usage**: Pour les liens vers des sites web, portails externes
- **Message**: "Ce document est disponible via un lien externe."

### `iconType: download`
- **Icône affichée**: Flèche téléchargement (download-outline)
- **Action**: "Télécharger"
- **Usage**: Pour les fichiers PDF, documents téléchargeables
- **Message**: "Ce document est disponible en téléchargement..."

## Icônes par type de document

Le système détermine automatiquement l'icône du document selon le type :

- **PDF**: `document-text`
- **Video**: `videocam`
- **PPT**: `easel`
- **Autre**: `document`

## Exemple d'ajout de document

```csv
44,Nouveau Guide,Guides,PDF,2024,Guide de bonnes pratiques 2024,https://example.com/guide.pdf,download,#007AFF
```

## Modification du fichier

1. Ouvrez `assets/documents.csv` dans un éditeur de texte ou Excel
2. Ajoutez/modifiez les lignes selon vos besoins
3. Respectez le format CSV (virgules comme séparateurs)
4. Redémarrez l'application pour voir les changements

## Couleurs par catégorie

- **URPS**: #FF6B6B (Rouge)
- **COVID**: #FF9500 (Orange)
- **Guides**: #007AFF (Bleu)
- **Certifications**: #34C759 (Vert)
- **Congrès**: #AF52DE (Violet)
- **Articles**: #5856D6 (Indigo)
- **Fiches**: #00C7BE (Turquoise)
- **Surveillance**: #FF3B30 (Rouge vif)
- **Spécialisations**: #8E8E93 (Gris)
- **Déchets**: #32D74B (Vert clair)
- **Contrôles**: #007AFF (Bleu)
- **Réglementation**: #FF2D92 (Rose)
- **International**: #FFCC02 (Jaune)
- **Médias**: #BF5AF2 (Violet clair)
- **Partenaires**: #6AC4DC (Bleu clair)
