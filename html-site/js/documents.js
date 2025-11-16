// Gestion des documents
(function() {
    'use strict';
    
    let allDocuments = [];
    let allCategories = [];
    let searchQuery = '';
    let selectedCategory = 'Tous';
    
    const documentsList = document.getElementById('documentsList');
    const documentsCount = document.getElementById('documentsCount');
    const searchInput = document.getElementById('searchInput');
    const categoriesList = document.getElementById('categoriesList');
    
    if (!documentsList) return;
    
    // Icônes par type de document
    const typeIcons = {
        'pdf': 'document-text',
        'video': 'videocam',
        'ppt': 'easel',
        'web': 'globe',
        'default': 'document'
    };
    
    // Charger les documents
    function loadDocuments() {
        try {
            // Les données sont maintenant chargées directement depuis data/documents.js
            // pour éviter les problèmes CORS avec le protocole file://
            if (window.DOCUMENTS_DATA) {
                allDocuments = window.DOCUMENTS_DATA.documents || [];
                allCategories = extractCategories(allDocuments);
                renderCategories();
                renderDocuments();
            } else {
                throw new Error('Documents data not loaded');
            }
        } catch (error) {
            console.error('Error loading documents:', error);
            showEmptyState('Erreur de chargement', 'Impossible de charger les documents');
        }
    }
    
    // Extraire les catégories depuis les documents
    function extractCategories(documents) {
        const categoriesMap = new Map();
        
        documents.forEach(doc => {
            if (!categoriesMap.has(doc.category)) {
                categoriesMap.set(doc.category, {
                    category: doc.category,
                    color: doc.color,
                    count: 0,
                    documents: []
                });
            }
            
            const cat = categoriesMap.get(doc.category);
            cat.count++;
            cat.documents.push(doc);
        });
        
        return Array.from(categoriesMap.values());
    }
    
    // Catégorie icons
    const categoryIcons = {
        'Tous': 'apps',
        'FORMATION': 'school',
        'LOCAUX HYGIENE PROTECTION': 'shield-checkmark',
        'DISPOSITIFS MEDICAUX': 'medical',
        'DASRI AIR EAU': 'water',
        'PROTOCOLES': 'document-text',
        'GUIDES OFFICIELS': 'book',
        'ARTICLES': 'newspaper',
        'A.R.S': 'business'
    };
    
    // Rendre les catégories
    function renderCategories() {
        if (!categoriesList) return;
        
        categoriesList.innerHTML = '';
        
        // Ajouter "Tous"
        const totalCount = allDocuments.length;
        const tousCard = createCategoryCard({
            category: 'Tous',
            color: '#007AFF',
            count: totalCount
        }, selectedCategory === 'Tous');
        categoriesList.appendChild(tousCard);
        
        // Ajouter les autres catégories
        allCategories.forEach(cat => {
            const card = createCategoryCard(cat, selectedCategory === cat.category);
            categoriesList.appendChild(card);
        });
    }
    
    // Créer une carte de catégorie
    function createCategoryCard(category, isActive) {
        const card = document.createElement('div');
        card.className = 'category-card' + (isActive ? ' active' : '');
        card.onclick = () => selectCategory(category.category);
        
        const icon = categoryIcons[category.category] || 'folder';
        
        card.innerHTML = `
            <div class="category-card-icon" style="background-color: ${category.color}15; color: ${category.color}">
                <ion-icon name="${icon}"></ion-icon>
            </div>
            <div class="category-card-title">${escapeHtml(category.category)}</div>
            <div class="category-card-count">${category.count} docs</div>
        `;
        
        return card;
    }
    
    // Sélectionner une catégorie
    function selectCategory(category) {
        selectedCategory = category;
        renderCategories();
        renderDocuments();
    }
    
    // Filtrer les documents selon la recherche et la catégorie
    function filterDocuments() {
        let filtered = selectedCategory === 'Tous' 
            ? allDocuments 
            : allDocuments.filter(doc => doc.category === selectedCategory);
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(doc => 
                doc.title.toLowerCase().includes(query) ||
                doc.description.toLowerCase().includes(query) ||
                doc.category.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }
    
    // Grouper les documents filtrés par catégorie
    function groupFilteredDocuments() {
        const filtered = filterDocuments();
        const grouped = new Map();
        
        filtered.forEach(doc => {
            if (!grouped.has(doc.category)) {
                grouped.set(doc.category, {
                    category: doc.category,
                    color: doc.color,
                    documents: []
                });
            }
            grouped.get(doc.category).documents.push(doc);
        });
        
        return Array.from(grouped.values());
    }
    
    // Créer un élément document
    function createDocumentElement(doc) {
        const item = document.createElement('div');
        item.className = 'document-item';
        item.onclick = () => handleDocumentClick(doc);
        
        const icon = typeIcons[doc.type?.toLowerCase()] || typeIcons.default;
        const actionIcon = doc.iconType === 'external' ? 'open-outline' : 'download-outline';
        
        item.innerHTML = `
            <div class="document-icon" style="background-color: ${doc.color}15; color: ${doc.color}">
                <ion-icon name="${icon}"></ion-icon>
            </div>
            <div class="document-content">
                <div class="document-title">${escapeHtml(doc.title)}</div>
                <div class="document-description">${escapeHtml(doc.description)}</div>
                <div class="document-meta">
                    <span class="document-type">${escapeHtml(doc.type)}</span>
                    ${doc.year ? `<span class="document-year">${escapeHtml(doc.year)}</span>` : ''}
                </div>
            </div>
            <ion-icon name="${actionIcon}"></ion-icon>
        `;
        
        return item;
    }
    
    // Créer un header de catégorie pour la recherche
    function createCategoryHeader(category) {
        const header = document.createElement('div');
        header.className = 'search-header-item';
        
        header.innerHTML = `
            <div class="document-icon" style="background-color: ${category.color}15; color: ${category.color}">
                <ion-icon name="albums-outline"></ion-icon>
            </div>
            <div class="document-content">
                <div class="search-header-title">${escapeHtml(category.category)}</div>
                <div class="document-description">${category.documents.length} document${category.documents.length > 1 ? 's' : ''} trouvé${category.documents.length > 1 ? 's' : ''}</div>
            </div>
        `;
        
        return header;
    }
    
    // Afficher l'état vide
    function showEmptyState(title = 'Aucun document trouvé', subtitle = 'Essayez avec d\'autres mots-clés') {
        documentsList.innerHTML = `
            <div class="empty-state">
                <ion-icon name="document-outline"></ion-icon>
                <div class="empty-state-text">${title}</div>
                <div class="empty-state-subtext">${subtitle}</div>
            </div>
        `;
    }
    
    // Rendre les documents
    function renderDocuments() {
        documentsList.innerHTML = '';
        
        if (searchQuery) {
            // Mode recherche : afficher par catégorie
            const groupedDocs = groupFilteredDocuments();
            
            if (groupedDocs.length === 0) {
                showEmptyState();
                updateCount(0);
                return;
            }
            
            let totalDocs = 0;
            groupedDocs.forEach(group => {
                // Header de catégorie
                documentsList.appendChild(createCategoryHeader(group));
                
                // Documents de cette catégorie
                group.documents.forEach(doc => {
                    documentsList.appendChild(createDocumentElement(doc));
                    totalDocs++;
                });
            });
            
            updateCount(totalDocs);
        } else {
            // Mode normal : afficher tous les documents
            const filtered = filterDocuments();
            
            if (filtered.length === 0) {
                showEmptyState('Aucun document disponible', 'Revenez plus tard');
                updateCount(0);
                return;
            }
            
            filtered.forEach(doc => {
                documentsList.appendChild(createDocumentElement(doc));
            });
            
            updateCount(filtered.length);
        }
    }
    
    // Mettre à jour le compteur
    function updateCount(count) {
        if (documentsCount) {
            documentsCount.textContent = `${count} élément${count > 1 ? 's' : ''}`;
        }
    }
    
    // Gérer le clic sur un document
    function handleDocumentClick(doc) {
        if (doc.url) {
            window.open(doc.url, '_blank');
        }
    }
    
    // Échapper le HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    // Gérer la recherche
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderDocuments();
        });
    }
    
    // Charger les documents au démarrage
    window.addEventListener('DOMContentLoaded', loadDocuments);
})();

