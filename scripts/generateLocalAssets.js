const fs = require('fs');
const path = require('path');

// Chemins
const localFilesDir = path.join(__dirname, '../assets/local-files');
const outputPath = path.join(__dirname, '../src/utils/localAssets.ts');

try {
  // Vérifier que le dossier existe
  if (!fs.existsSync(localFilesDir)) {
    console.log('⚠️  Dossier local-files non trouvé, création...');
    fs.mkdirSync(localFilesDir, { recursive: true });
  }

  // Scanner le dossier local-files
  const files = fs.readdirSync(localFilesDir)
    .filter(file => {
      // Ignorer les fichiers cachés, les dossiers, et les .md
      const filePath = path.join(localFilesDir, file);
      const isFile = fs.statSync(filePath).isFile();
      const isHidden = file.startsWith('.');
      const isMarkdown = file.endsWith('.md');
      return isFile && !isHidden && !isMarkdown;
    });

  if (files.length === 0) {
    console.log('⚠️  Aucun fichier trouvé dans assets/local-files/');
  }

  // Générer le mapping des fichiers
  const assetsMapping = files.map(file => {
    return `  '${file}': require('../../assets/local-files/${file}'),`;
  }).join('\n');

  // Générer le contenu TypeScript
  const tsContent = `import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';

// Mapping des fichiers locaux (généré automatiquement)
// Pour ajouter un fichier : placez-le dans assets/local-files/ et relancez 'npm run generate-local-assets'
const LOCAL_ASSETS: { [key: string]: any } = {
${assetsMapping}
};

/**
 * Vérifie si une URL est un fichier local
 */
export function isLocalFile(url: string): boolean {
  return url.startsWith('file://');
}

/**
 * Extrait le nom du fichier d'une URL file://
 */
export function getLocalFileName(url: string): string {
  return url.replace('file://', '');
}

/**
 * Ouvre ou télécharge un fichier local
 */
export async function openLocalFile(url: string): Promise<void> {
  const fileName = getLocalFileName(url);
  
  if (!LOCAL_ASSETS[fileName]) {
    throw new Error(\`Fichier local non trouvé: \${fileName}. Fichiers disponibles: \${Object.keys(LOCAL_ASSETS).join(', ')}\`);
  }

  if (Platform.OS === 'web') {
    // Sur le web, on force le téléchargement
    await downloadFileWeb(fileName);
  } else {
    // Sur mobile, on partage le fichier
    await shareFileNative(fileName);
  }
}

/**
 * Télécharge un fichier sur le web
 */
async function downloadFileWeb(fileName: string): Promise<void> {
  try {
    // Charger l'asset
    const asset = Asset.fromModule(LOCAL_ASSETS[fileName]);
    await asset.downloadAsync();
    
    if (asset.localUri) {
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = asset.localUri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw error;
  }
}

/**
 * Partage un fichier sur mobile (iOS/Android)
 */
async function shareFileNative(fileName: string): Promise<void> {
  try {
    // Charger l'asset
    const asset = Asset.fromModule(LOCAL_ASSETS[fileName]);
    await asset.downloadAsync();
    
    if (!asset.localUri) {
      throw new Error('Impossible de charger le fichier');
    }

    // Utiliser directement l'URI de l'asset ou le copier si nécessaire
    let fileUri = asset.localUri;
    
    // Si l'URI n'est pas directement accessible, on copie le fichier
    if (fileUri.startsWith('asset://') && (FileSystem as any).documentDirectory) {
      const destUri = \`\${(FileSystem as any).documentDirectory}\${fileName}\`;
      await FileSystem.copyAsync({
        from: fileUri,
        to: destUri,
      });
      fileUri = destUri;
    }

    // Vérifier si le partage est disponible
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: getMimeType(fileName),
        dialogTitle: 'Ouvrir le document',
      });
    } else {
      throw new Error('Le partage de fichiers n\\'est pas disponible sur cet appareil');
    }
  } catch (error) {
    console.error('Erreur lors du partage:', error);
    throw error;
  }
}

/**
 * Détermine le type MIME d'un fichier
 */
function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc': 'application/msword',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ppt': 'application/vnd.ms-powerpoint',
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
}

/**
 * Récupère la liste des fichiers locaux disponibles
 */
export function getAvailableLocalFiles(): string[] {
  return Object.keys(LOCAL_ASSETS);
}
`;

  // Écrire le fichier TypeScript
  fs.writeFileSync(outputPath, tsContent, 'utf8');
  
  console.log('✅ Fichiers locaux générés avec succès!');
  console.log(`📁 Dossier scanné: ${localFilesDir}`);
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📦 ${files.length} fichier(s) trouvé(s):`);
  files.forEach(file => console.log(`   - ${file}`));
  
} catch (error) {
  console.error('❌ Erreur lors de la génération des fichiers locaux:', error);
  process.exit(1);
}

