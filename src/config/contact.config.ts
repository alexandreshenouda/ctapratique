// Configuration du formulaire de contact avec FormSubmit
// 
// FormSubmit est un service gratuit et simple qui envoie les formulaires par email
// sans nécessiter d'inscription ni de clé API.
//
// Pour configurer :
// 1. Remplacez 'contact@ctapratique.com' par votre email
// 2. C'est tout ! 🎉

export const CONTACT_CONFIG = {
  // L'email qui recevra tous les messages du formulaire
  recipientEmail: 'felzou23@gmail.com',
  
  // Options FormSubmit (optionnel)
  options: {
    // Redirection après envoi (laisser vide pour rester sur la page)
    redirectUrl: '',
    
    // Objet personnalisé de l'email
    subject: 'Nouveau message depuis le formulaire de contact',
  }
};

// Documentation FormSubmit : https://formsubmit.co/

