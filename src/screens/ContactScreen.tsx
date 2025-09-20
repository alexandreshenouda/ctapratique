import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ContactInfoProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  action?: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, label, value, action }) => (
  <TouchableOpacity style={styles.contactInfoItem} onPress={action}>
    <View style={styles.contactIcon}>
      <Ionicons name={icon} size={24} color="#007AFF" />
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

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.message) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires (Nom, Email, Message)');
      return;
    }

    Alert.alert(
      'Message envoyé',
      'Merci pour votre message ! Nous vous contacterons bientôt.',
      [{ text: 'OK', onPress: () => {
        setForm({
          nom: '',
          email: '',
          telephone: '',
          adresse: '',
          ville: '',
          objet: '',
          message: '',
        });
      }}]
    );
  };

  const contactMethods = [
    {
      icon: 'mail' as const,
      label: 'Email',
      value: 'contact@ctapratique.com',
      action: () => {
        // In a real app, this would open the email client
        Alert.alert('Email', 'Ouverture du client email...');
      },
    },
    {
      icon: 'call' as const,
      label: 'Téléphone',
      value: '06.73.84.77.66',
      action: () => {
        // In a real app, this would make a phone call
        Alert.alert('Appel', 'Composition du numéro...');
      },
    },
    {
      icon: 'location' as const,
      label: 'Zones de formation',
      value: '9 villes disponibles',
    },
    {
      icon: 'time' as const,
      label: 'Horaires',
      value: 'Lun-Ven: 9h-18h',
    },
  ];

  const cities = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 
    'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nous Contacter</Text>
          <Text style={styles.headerSubtitle}>
            Pour toute demande de renseignement ou de tarif
          </Text>
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

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.submitButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cities Available */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VILLES DE FORMATION</Text>
          <View style={styles.citiesContainer}>
            <Text style={styles.citiesDescription}>
              Formations disponibles dans 9 villes en France :
            </Text>
            <View style={styles.citiesGrid}>
              {cities.map((city, index) => (
                <View key={index} style={styles.cityTag}>
                  <Ionicons name="location" size={16} color="#007AFF" />
                  <Text style={styles.cityText}>{city}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.citiesNote}>
              D'autres régions seront disponibles prochainement
            </Text>
          </View>
        </View>

        {/* Quick Stats Reminder */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Pourquoi nous choisir ?</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30</Text>
              <Text style={styles.statLabel}>Années d'expérience</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>305</Text>
              <Text style={styles.statLabel}>Professionnels formés</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>97%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#007AFF',
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  citiesContainer: {
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
  citiesDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontWeight: '500',
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  cityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  cityText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  citiesNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  statsSection: {
    backgroundColor: 'white',
    margin: 20,
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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ContactScreen;
