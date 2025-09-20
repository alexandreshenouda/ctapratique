// Thème médical et santé pour l'application C ta Pratique

export const MedicalTheme = {
  // Couleurs principales - tons médicaux
  primary: '#2E86AB',           // Bleu médical professionnel
  primaryDark: '#1B5E83',       // Bleu plus foncé
  primaryLight: '#4A9BC7',      // Bleu plus clair
  
  // Couleurs secondaires - tons santé
  secondary: '#A23B72',         // Magenta médical
  secondaryLight: '#B85A8A',    // Magenta clair
  
  // Couleurs d'accent - tons verts santé
  success: '#28A745',           // Vert succès médical
  successLight: '#48C765',      // Vert clair
  
  // Couleurs de support
  warning: '#F39422',           // Orange attention médicale
  error: '#DC3545',             // Rouge médical
  info: '#17A2B8',              // Cyan informatif
  
  // Couleurs neutres - tons propres et stériles
  background: '#F8FAFB',        // Blanc cassé très léger
  surface: '#FFFFFF',           // Blanc pur
  surfaceLight: '#F1F5F8',      // Gris très clair
  
  // Couleurs de texte
  textPrimary: '#2C3E50',       // Gris-bleu foncé professionnel
  textSecondary: '#5A6C7D',     // Gris-bleu moyen
  textLight: '#8B9DC3',         // Gris-bleu clair
  textOnPrimary: '#FFFFFF',     // Blanc sur couleurs primaires
  
  // Couleurs de bordure
  border: '#E1E8ED',            // Gris très clair
  borderLight: '#F0F4F8',       // Gris ultra clair
  
  // Couleurs spécifiques domaine médical
  medical: {
    sterilization: '#00BCD4',   // Cyan stérilisation
    hygiene: '#4CAF50',         // Vert hygiène
    safety: '#FF9800',          // Orange sécurité
    formation: '#9C27B0',       // Violet formation
    certification: '#673AB7',    // Indigo certification
  },
  
  // Couleurs de statut
  status: {
    active: '#28A745',
    inactive: '#6C757D',
    pending: '#FFC107',
    completed: '#17A2B8',
  }
};

// Couleurs par catégorie pour les documents
export const CategoryColors = {
  'URPS': MedicalTheme.medical.formation,
  'Formation': MedicalTheme.medical.certification,
  'COVID': MedicalTheme.warning,
  'Hygiène': MedicalTheme.medical.hygiene,
  'Stérilisation': MedicalTheme.medical.sterilization,
  'Sécurité': MedicalTheme.medical.safety,
  'Réglementation': MedicalTheme.secondary,
  'Certification': MedicalTheme.medical.certification,
  'Protocole': MedicalTheme.info,
  'Tous': MedicalTheme.primary,
};

export default MedicalTheme;
