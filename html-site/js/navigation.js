// Gestion de la navigation entre les onglets
(function() {
    'use strict';
    
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Fonction pour changer d'onglet
    function switchTab(tabId) {
        // Désactiver tous les onglets
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Activer l'onglet sélectionné
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        
        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.classList.add('active');
            
            // Sauvegarder l'onglet actif
            localStorage.setItem('activeTab', tabId);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Ajouter les event listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Restaurer l'onglet actif au chargement
    window.addEventListener('DOMContentLoaded', () => {
        const savedTab = localStorage.getItem('activeTab') || 'documents';
        switchTab(savedTab);
    });
})();

