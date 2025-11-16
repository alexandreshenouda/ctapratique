// Configuration du formulaire de contact avec Web3Forms
// 
// Web3Forms est un service gratuit qui supporte CORS et fonctionne partout.
// Gratuit : 250 emails/mois
//
// Pour obtenir votre Access Key :
// 1. Allez sur https://web3forms.com/
// 2. Entrez votre email : felzou23@gmail.com
// 3. Vous recevrez votre Access Key instantanément par email
// 4. Remplacez 'YOUR_ACCESS_KEY' ci-dessous par votre vraie clé

export const CONTACT_CONFIG = {
  // Votre Access Key Web3Forms (récupérée par email)
  accessKey: 'cf2a3400-4be6-44f7-ad20-134a182ba064',
  
  // Email qui recevra les messages (pour référence)
  recipientEmail: 'felzou23@gmail.com',
  
  // Options
  options: {
    // Objet de l'email
    subject: 'Nouveau message depuis le formulaire de contact',
  }
};

// Documentation Web3Forms : https://docs.web3forms.com/

