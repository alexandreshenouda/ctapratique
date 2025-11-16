// Script principal
(function() {
    'use strict';
    
    // Initialisation au chargement de la page
    window.addEventListener('DOMContentLoaded', () => {
        console.log('Site chargé avec succès');
        
        // Smooth scroll pour les ancres
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });
    
    // Gestion des erreurs globales
    window.addEventListener('error', (e) => {
        console.error('Erreur:', e.message);
    });
    
    // Exposer les fonctions utilitaires globalement si nécessaire
    window.app = {
        version: '1.0.0',
        ready: true
    };
})();

