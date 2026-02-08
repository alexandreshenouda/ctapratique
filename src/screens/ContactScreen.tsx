import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CONTACT_CONFIG } from '../config/contact.config';
import MedicalTheme from '../theme/colors';

interface ContactInfoProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  action?: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, label, value, action }) => (
  <TouchableOpacity style={styles.contactInfoItem} onPress={action}>
    <View style={styles.contactIcon}>
      <Ionicons name={icon} size={24} color="MedicalTheme.primary" />
    </View>
    <View style={styles.contactContent}>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
    {action && <Ionicons name="chevron-forward" size={20} color="#666" />}
  </TouchableOpacity>
);

const ContactScreen: React.FC = () => {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    objet: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successOpacity] = useState(new Animated.Value(0));

  // Animation du message de succès
  useEffect(() => {
    if (showSuccessMessage) {
      // Fade in
      Animated.sequence([
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        // Fade out
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSuccessMessage(false);
      });
    }
  }, [showSuccessMessage, successOpacity]);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.nom || !form.email || !form.message) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires (Nom, Email, Message)');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    // Vérifier que Web3Forms est configuré
    if (CONTACT_CONFIG.accessKey === 'YOUR_ACCESS_KEY') {
      Alert.alert(
        'Configuration requise',
        'Veuillez configurer votre Access Key Web3Forms dans src/config/contact.config.ts\n\n1. Allez sur https://web3forms.com/\n2. Entrez votre email pour recevoir votre Access Key\n3. Remplacez YOUR_ACCESS_KEY dans le fichier de config'
      );
      return;
    }

    setIsSending(true);

    try {
      // Préparer les données pour Web3Forms
      const formData = new FormData();
      formData.append('access_key', CONTACT_CONFIG.accessKey);
      formData.append('name', form.nom);
      formData.append('email', form.email);
      formData.append('phone', form.telephone || 'Non renseigné');
      formData.append('address', form.adresse || 'Non renseignée');
      formData.append('city', form.ville || 'Non renseignée');
      formData.append('subject', form.objet || CONTACT_CONFIG.options.subject);
      formData.append('message', form.message);
      formData.append('from_name', form.nom);

      // Envoyer via Web3Forms (supporte CORS)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Nettoyer le formulaire immédiatement
        setForm({
          nom: '',
          email: '',
          telephone: '',
          adresse: '',
          ville: '',
          objet: '',
          message: '',
        });
        
        // Afficher le message de succès animé
        setShowSuccessMessage(true);
        
        // Afficher aussi une alerte sur mobile
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Message envoyé',
            'Merci pour votre message ! Nous vous contacterons bientôt.'
          );
        }
      } else {
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer ou nous contacter directement par email.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleEmailPress = async () => {
    const email = 'contact@ctapratique.com';
    const subject = 'Demande de renseignement';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    try {
      if (Platform.OS === 'web') {
        window.open(mailtoUrl, '_self');
      } else {
        const supported = await Linking.canOpenURL(mailtoUrl);
        if (supported) {
          await Linking.openURL(mailtoUrl);
        } else {
          Alert.alert('Erreur', 'Impossible d\'ouvrir le client email');
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le client email');
    }
  };

  const handlePhonePress = async () => {
    const phoneNumber = '0673847766';
    const telUrl = `tel:${phoneNumber}`;
    
    try {
      if (Platform.OS === 'web') {
        window.open(telUrl, '_self');
      } else {
        const supported = await Linking.canOpenURL(telUrl);
        if (supported) {
          await Linking.openURL(telUrl);
        } else {
          Alert.alert('Erreur', 'Impossible de composer le numéro');
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de composer le numéro');
    }
  };

  const contactMethods = [
    {
      icon: 'mail' as const,
      label: 'Email',
      value: 'contact@ctapratique.com',
      action: handleEmailPress,
    },
    {
      icon: 'call' as const,
      label: 'Téléphone',
      value: '06.73.84.77.66',
      action: handlePhonePress,
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Message de succès */}
      {showSuccessMessage && (
        <Animated.View 
          style={[
            styles.successBanner,
            { opacity: successOpacity }
          ]}
        >
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <View style={styles.successTextContainer}>
            <Text style={styles.successTitle}>Message envoyé !</Text>
            <Text style={styles.successMessage}>
              Merci pour votre message. Nous vous contacterons bientôt.
            </Text>
          </View>
        </Animated.View>
      )}
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.jpg')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nous Contacter</Text>
        <Text style={styles.headerSubtitle}>
          Pour toute demande de renseignement
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.profileIconContainer}>
              <Ionicons name="person-circle" size={64} color={MedicalTheme.primary} />
            </View>
            <Text style={styles.profileName}>Stéphane Sananès</Text>
            <View style={styles.profileDivider} />
            <View style={styles.profileDetail}>
              <Ionicons name="medkit" size={18} color={MedicalTheme.primary} style={styles.profileDetailIcon} />
              <Text style={styles.profileDetailText}>
                Formateur en hygiène et asepsie hospitalière et dentaire
              </Text>
            </View>
            <View style={styles.profileDetail}>
              <Ionicons name="search" size={18} color={MedicalTheme.primary} style={styles.profileDetailIcon} />
              <Text style={styles.profileDetailText}>
                Consultant audit en cabinet dentaire et ophtalmologique
              </Text>
            </View>
            <View style={styles.profileDetail}>
              <Ionicons name="school" size={18} color={MedicalTheme.primary} style={styles.profileDetailIcon} />
              <Text style={styles.profileDetailText}>
                Titulaire de deux diplômes universitaires (DU en stérilisation hospitalière, DIU infections nosocomiales et qualité de soins)
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE CONTACT</Text>
          {contactMethods.map((method, index) => (
            <ContactInfo
              key={index}
              icon={method.icon}
              label={method.label}
              value={method.value}
              action={method.action}
            />
          ))}
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEMANDER UN RENSEIGNEMENT</Text>
          
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom *</Text>
              <TextInput
                style={styles.textInput}
                value={form.nom}
                onChangeText={(text) => handleInputChange('nom', text)}
                placeholder="Votre nom complet"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={form.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="votre.email@exemple.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Téléphone</Text>
              <TextInput
                style={styles.textInput}
                value={form.telephone}
                onChangeText={(text) => handleInputChange('telephone', text)}
                placeholder="06 XX XX XX XX"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse</Text>
              <TextInput
                style={styles.textInput}
                value={form.adresse}
                onChangeText={(text) => handleInputChange('adresse', text)}
                placeholder="Votre adresse"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ville</Text>
              <TextInput
                style={styles.textInput}
                value={form.ville}
                onChangeText={(text) => handleInputChange('ville', text)}
                placeholder="Votre ville"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Objet</Text>
              <TextInput
                style={styles.textInput}
                value={form.objet}
                onChangeText={(text) => handleInputChange('objet', text)}
                placeholder="Objet de votre demande"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={form.message}
                onChangeText={(text) => handleInputChange('message', text)}
                placeholder="Votre message..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isSending && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.submitButtonText}>Envoi en cours...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="send" size={20} color="white" />
                  <Text style={styles.submitButtonText}>Envoyer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  logoContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    backgroundColor: MedicalTheme.primary,
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    ...Platform.select({
      web: {
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 40,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
    }),
  },
  profileIconContainer: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: MedicalTheme.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  profileDivider: {
    width: 60,
    height: 3,
    backgroundColor: MedicalTheme.primary,
    borderRadius: 2,
    marginBottom: 16,
    opacity: 0.6,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  profileDetailIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  profileDetailText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    flex: 1,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
    }),
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: MedicalTheme.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successBanner: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 10,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      },
    }),
  },
  successTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  successTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  successMessage: {
    color: 'white',
    fontSize: 14,
    opacity: 0.95,
  },
});

export default ContactScreen;
