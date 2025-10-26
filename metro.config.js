const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajouter le support des fichiers Office et autres assets locaux
config.resolver.assetExts.push(
  // Documents Office
  'docx',
  'doc',
  'xlsx',
  'xls',
  'pptx',
  'ppt',
  // Autres formats courants
  'csv'
);

module.exports = config;
