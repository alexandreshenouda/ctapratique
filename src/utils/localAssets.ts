import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';

// Mapping des fichiers locaux (généré automatiquement)
// Pour ajouter un fichier : placez-le dans assets/local-files/ et relancez 'npm run generate-local-assets'
const LOCAL_ASSETS: { [key: string]: any } = {
  'f_fich_ster_S240917_v2.0.docx': require('../../assets/local-files/f_fich_ster_S240917_v2.0.docx'),
  'F_trac_entr_C240917_V2.0.xlsx': require('../../assets/local-files/F_trac_entr_C240917_V2.0.xlsx'),
  'Tableur_check_list_Gestion_DAS_VF.xlsx': require('../../assets/local-files/Tableur_check_list_Gestion_DAS_VF.xlsx'),
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
    throw new Error(`Fichier local non trouvé: ${fileName}. Fichiers disponibles: ${Object.keys(LOCAL_ASSETS).join(', ')}`);
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
      const destUri = `${(FileSystem as any).documentDirectory}${fileName}`;
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
      throw new Error('Le partage de fichiers n\'est pas disponible sur cet appareil');
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
