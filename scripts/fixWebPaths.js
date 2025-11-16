const fs = require('fs');
const path = require('path');

// Chemins
const distPath = path.join(__dirname, '../dist');
const htmlPath = path.join(distPath, 'index.html');

/**
 * Remplace les chemins absolus par des chemins relatifs dans un fichier
 */
function fixPathsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remplacer tous les chemins absolus commençant par /
  const replacements = [
    { from: /"\/_expo\//g, to: '"./_expo/' },
    { from: /'\/_expo\//g, to: "'./_expo/" },
    { from: /"\/assets\//g, to: '"./assets/' },
    { from: /'\/assets\//g, to: "'./assets/" },
    { from: /url\(\/_expo\//g, to: 'url(./_expo/' },
    { from: /url\(\/assets\//g, to: 'url(./assets/' },
    // Pour les imports/require dans le JS
    { from: /"\/node_modules\//g, to: '"./node_modules/' },
    { from: /'\/node_modules\//g, to: "'./node_modules/" },
  ];
  
  replacements.forEach(({ from, to }) => {
    const newContent = content.replace(from, to);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

/**
 * Parcourt récursivement tous les fichiers JS et HTML
 */
function fixAllPaths(dir, stats = { fixed: 0, scanned: 0 }) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixAllPaths(filePath, stats);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      stats.scanned++;
      if (fixPathsInFile(filePath)) {
        stats.fixed++;
        console.log(`  ✓ ${path.relative(distPath, filePath)}`);
      }
    }
  });
  
  return stats;
}

try {
  console.log('🔧 Correction des chemins pour GitHub Pages ...\n');
  
  const stats = fixAllPaths(distPath);
  
  // Créer le fichier .nojekyll pour GitHub Pages
  const nojekyllPath = path.join(distPath, '.nojekyll');
  fs.writeFileSync(nojekyllPath, '', 'utf8');
  console.log('  ✓ Créé .nojekyll pour GitHub Pages');
  
  console.log('\n✅ Correction terminée !');
  console.log(`📊 Statistiques :`);
  console.log(`   - Fichiers scannés : ${stats.scanned}`);
  console.log(`   - Fichiers modifiés : ${stats.fixed}`);
  console.log('');
  console.log('📂 Vous pouvez maintenant :');
  console.log('   1. Déployer le dossier dist/ sur GitHub Pages');
  console.log('   2. Ou tester localement: npm run serve:web');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction des chemins:', error);
  process.exit(1);
}

