const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const PASSWORD = 'CTP2026';
const DIST_PATH = path.join(__dirname, '../dist');

// Hash du mot de passe pour la vérification (SHA256)
const PASSWORD_HASH = CryptoJS.SHA256(PASSWORD).toString();

console.log('🔐 Chiffrement du build...\n');

// Fonction pour chiffrer un fichier
function encryptFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const encrypted = CryptoJS.AES.encrypt(content, PASSWORD).toString();
        fs.writeFileSync(filePath + '.encrypted', encrypted, 'utf8');
        fs.unlinkSync(filePath); // Supprimer l'original
        console.log(`  ✓ Chiffré: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        console.error(`  ✗ Erreur lors du chiffrement de ${filePath}:`, error.message);
        return false;
    }
}

// Fonction récursive pour trouver et chiffrer les fichiers
function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            // Chiffrer uniquement les fichiers JS et CSS
            if ((ext === '.js' || ext === '.css') && !item.includes('.encrypted')) {
                encryptFile(fullPath);
            }
        }
    });
}

// Copier le logo dans dist/assets et créer le manifest
function createManifestAndIcons() {
    const logoSrc = path.join(__dirname, '../assets/logo.jpg');
    const assetsDir = path.join(DIST_PATH, 'assets');

    // S'assurer que le dossier assets existe
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Copier logo.jpg dans dist/assets/ (chemin stable sans hash)
    const logoDest = path.join(assetsDir, 'logo.jpg');
    if (fs.existsSync(logoSrc)) {
        fs.copyFileSync(logoSrc, logoDest);
        console.log('  ✓ Logo copié: assets/logo.jpg');
    } else {
        console.warn('  ⚠ Logo source non trouvé:', logoSrc);
    }

    // Créer le manifest.json
    const manifest = {
        name: 'CTA Pratique',
        short_name: 'CTAPratique',
        description: 'Formation en hygiène et asepsie hospitalière et dentaire',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0066CC',
        icons: [
            {
                src: 'assets/logo.jpg',
                sizes: '192x192',
                type: 'image/jpeg',
                purpose: 'any'
            },
            {
                src: 'assets/logo.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
                purpose: 'any'
            }
        ]
    };

    fs.writeFileSync(
        path.join(DIST_PATH, 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf8'
    );
    console.log('  ✓ Manifest créé: manifest.json');
}

// Créer la page de login
function createLoginPage() {
    const loginHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="CTAPratique">
    <meta name="theme-color" content="#0066CC">
    <title>Accès sécurisé - CTA Pratique</title>
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="assets/logo.jpg">
    <link rel="icon" type="image/jpeg" href="assets/logo.jpg">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .logo {
            width: 100px;
            height: 70px;
            margin: 0 auto 30px;
            display: block;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #0066CC;
            font-size: 24px;
            text-align: center;
            margin-bottom: 10px;
        }
        
        p {
            color: #666;
            text-align: center;
            margin-bottom: 30px;
            font-size: 14px;
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #E0E0E0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input[type="password"]:focus {
            outline: none;
            border-color: #0066CC;
        }
        
        button {
            width: 100%;
            padding: 14px;
            background: #0066CC;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        button:hover {
            background: #0052A3;
        }
        
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .error {
            background: #FFE8E8;
            color: #C00;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        
        .error.show {
            display: block;
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .loading {
            display: none;
            text-align: center;
            color: #666;
            margin-top: 20px;
        }
        
        .loading.show {
            display: block;
        }
        
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #0066CC;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 10px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <img src="assets/logo.jpg" alt="Logo" class="logo" onerror="this.style.display='none'">
        <h1>Accès Sécurisé</h1>
        <p>Veuillez entrer le mot de passe pour accéder au contenu</p>
        
        <div class="error" id="error">Mot de passe incorrect</div>
        
        <form id="loginForm">
            <div class="input-group">
                <label for="password">Mot de passe</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Entrez le mot de passe"
                    autocomplete="off"
                    required
                >
            </div>
            
            <button type="submit" id="submitBtn">Accéder</button>
        </form>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Déchiffrement en cours...</p>
        </div>
    </div>
    
    <script>
        const PASSWORD_HASH = '${PASSWORD_HASH}';
        const ENCRYPTED_FILES = ${JSON.stringify({})};
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const error = document.getElementById('error');
            const loading = document.getElementById('loading');
            const submitBtn = document.getElementById('submitBtn');
            
            // Vérifier le hash du mot de passe
            const enteredHash = CryptoJS.SHA256(password).toString();
            
            if (enteredHash !== PASSWORD_HASH) {
                error.classList.add('show');
                document.getElementById('password').value = '';
                setTimeout(() => error.classList.remove('show'), 3000);
                return;
            }
            
            // Mot de passe correct, déchiffrer et charger l'app
            error.classList.remove('show');
            loading.classList.add('show');
            submitBtn.disabled = true;
            
            try {
                // Stocker le mot de passe en session pour permettre le déchiffrement
                sessionStorage.setItem('appKey', password);
                
                // Attendre un peu pour l'effet visuel
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Charger la page principale
                window.location.href = 'app.html';
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors du déchiffrement');
                loading.classList.remove('show');
                submitBtn.disabled = false;
            }
        });
        
        // Focus automatique sur le champ de mot de passe
        document.getElementById('password').focus();
    </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(DIST_PATH, 'index.html'), loginHTML, 'utf8');
    console.log('  ✓ Page de login créée: index.html');
}

// Créer la page de l'application chiffrée
function createAppPage() {
    const originalIndexPath = path.join(DIST_PATH, 'index.original.html');
    const appPagePath = path.join(DIST_PATH, 'app.html');
    
    // Lire le fichier HTML original
    if (fs.existsSync(originalIndexPath)) {
        let originalContent = fs.readFileSync(originalIndexPath, 'utf8');
        
        // Trouver tous les fichiers JS chiffrés
        const encryptedFiles = {};
        
        function findEncryptedFiles(dirPath, baseDir = '') {
            const items = fs.readdirSync(dirPath);
            items.forEach(item => {
                const fullPath = path.join(dirPath, item);
                const relativePath = path.join(baseDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    findEncryptedFiles(fullPath, relativePath);
                } else if (item.endsWith('.encrypted')) {
                    const encryptedContent = fs.readFileSync(fullPath, 'utf8');
                    encryptedFiles[relativePath.replace('.encrypted', '').replace(/\\/g, '/')] = encryptedContent;
                }
            });
        }
        
        findEncryptedFiles(DIST_PATH);
        
        // Créer le script de déchiffrement
        const decryptScript = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
    <script>
        (function() {
            // Vérifier l'authentification
            const appKey = sessionStorage.getItem('appKey');
            if (!appKey) {
                window.location.href = 'index.html';
                return;
            }
            
            // Fichiers chiffrés
            const ENCRYPTED_FILES = ${JSON.stringify(encryptedFiles, null, 2)};
            
            // Déchiffrer et charger le bundle principal
            const mainBundlePath = Object.keys(ENCRYPTED_FILES).find(path => 
                path.includes('AppEntry') && path.endsWith('.js')
            );
            
            if (mainBundlePath) {
                try {
                    const encryptedContent = ENCRYPTED_FILES[mainBundlePath];
                    const decrypted = CryptoJS.AES.decrypt(encryptedContent, appKey).toString(CryptoJS.enc.Utf8);
                    
                    if (!decrypted || decrypted.length === 0) {
                        throw new Error('Déchiffrement échoué - contenu vide');
                    }
                    
                    // Créer et exécuter le script
                    const script = document.createElement('script');
                    script.textContent = decrypted;
                    script.defer = true;
                    document.body.appendChild(script);
                    
                    console.log('✅ Application déchiffrée et chargée avec succès');
                } catch (error) {
                    console.error('❌ Erreur de déchiffrement:', error);
                    alert('Erreur lors du déchiffrement de l\\'application. Veuillez vous reconnecter.');
                    sessionStorage.removeItem('appKey');
                    window.location.href = 'index.html';
                }
            } else {
                console.error('❌ Fichier principal non trouvé');
                alert('Erreur: fichier principal non trouvé');
            }
        })();
    </script>`;
        
        // Injecter les balises PWA dans le <head> de app.html
        const pwaHeadTags = `
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="assets/logo.jpg">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="CTAPratique">
    <meta name="theme-color" content="#0066CC">`;
        originalContent = originalContent.replace('</head>', pwaHeadTags + '\n  </head>');
        
        // Remplacer les références aux scripts JS par notre script de déchiffrement
        // Retirer tous les scripts existants qui pointent vers des fichiers .js
        originalContent = originalContent.replace(
            /<script[^>]*src=["'][^"']*\.js["'][^>]*><\/script>/gi,
            ''
        );
        
        // Injecter le script de déchiffrement juste avant </body>
        originalContent = originalContent.replace(
            '</body>',
            decryptScript + '\n</body>'
        );
        
        fs.writeFileSync(appPagePath, originalContent, 'utf8');
        console.log('  ✓ Page de l\'application créée: app.html');
    }
}

// Exécuter le processus
try {
    if (!fs.existsSync(DIST_PATH)) {
        console.error('❌ Le dossier dist/ n\'existe pas. Veuillez d\'abord générer le build.');
        process.exit(1);
    }
    
    // Sauvegarder l'index.html original avant de le remplacer
    const originalIndex = path.join(DIST_PATH, 'index.html');
    const backupIndex = path.join(DIST_PATH, 'index.original.html');
    if (fs.existsSync(originalIndex) && !fs.existsSync(backupIndex)) {
        fs.copyFileSync(originalIndex, backupIndex);
    }
    
    // Chiffrer les fichiers
    console.log('Chiffrement des fichiers JS et CSS...');
    processDirectory(DIST_PATH);
    
    console.log('\nCréation du manifest et copie des icônes...');
    createManifestAndIcons();
    
    console.log('\nCréation des pages...');
    createAppPage();
    createLoginPage();
    
    console.log('\n✅ Build chiffré avec succès!');
    console.log(`📝 Hash du mot de passe: ${PASSWORD_HASH}`);
    console.log('🔑 Mot de passe: CTP2026');
    
} catch (error) {
    console.error('❌ Erreur lors du chiffrement:', error);
    process.exit(1);
}

