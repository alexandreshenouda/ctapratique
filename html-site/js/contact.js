// Gestion du formulaire de contact
(function() {
    'use strict';
    
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    
    if (!form) return;
    
    // Fonction pour afficher une alerte
    function showAlert(title, message, isError = false) {
        alert(`${title}\n\n${message}`);
    }
    
    // Fonction pour valider l'email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Fonction pour activer/désactiver le bouton
    function setButtonLoading(loading) {
        submitButton.disabled = loading;
        
        if (loading) {
            submitButton.innerHTML = `
                <div class="loading"></div>
                <span>Envoi en cours...</span>
            `;
        } else {
            submitButton.innerHTML = `
                <ion-icon name="send"></ion-icon>
                <span>Envoyer</span>
            `;
        }
    }
    
    // Soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const nom = formData.get('nom').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Validation
        if (!nom || !email || !message) {
            showAlert('Erreur', 'Veuillez remplir les champs obligatoires (Nom, Email, Message)', true);
            return;
        }
        
        if (!isValidEmail(email)) {
            showAlert('Erreur', 'Veuillez entrer une adresse email valide', true);
            return;
        }
        
        // Vérifier la configuration
        if (CONFIG.accessKey === 'YOUR_ACCESS_KEY') {
            showAlert(
                'Configuration requise',
                'Veuillez configurer votre Access Key Web3Forms dans js/config.js\n\n' +
                '1. Allez sur https://web3forms.com/\n' +
                '2. Entrez votre email pour recevoir votre Access Key\n' +
                '3. Remplacez YOUR_ACCESS_KEY dans le fichier de config',
                true
            );
            return;
        }
        
        setButtonLoading(true);
        
        try {
            // Préparer les données pour Web3Forms
            const submitData = new FormData();
            submitData.append('access_key', CONFIG.accessKey);
            submitData.append('name', nom);
            submitData.append('email', email);
            submitData.append('phone', formData.get('telephone') || 'Non renseigné');
            submitData.append('address', formData.get('adresse') || 'Non renseignée');
            submitData.append('city', formData.get('ville') || 'Non renseignée');
            submitData.append('subject', formData.get('objet') || CONFIG.emailSubject);
            submitData.append('message', message);
            submitData.append('from_name', nom);
            
            // Envoyer via Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: submitData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert(
                    'Message envoyé',
                    'Merci pour votre message ! Nous vous contacterons bientôt.'
                );
                
                // Réinitialiser le formulaire
                form.reset();
            } else {
                throw new Error(data.message || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            showAlert(
                'Erreur',
                'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer ou nous contacter directement par email.',
                true
            );
        } finally {
            setButtonLoading(false);
        }
    });
})();

