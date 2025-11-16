import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MedicalTheme from '../theme/colors';

const HomeScreen: React.FC = () => {
  const statistics = [
    { number: '30', label: 'Années d\'expérience\ndans la formation', icon: 'time' as const },
    { number: '305', label: 'Chirurgiens-dentistes\nformés', icon: 'people' as const },
    { number: '97%', label: 'Taux de satisfaction', icon: 'star' as const },
    { number: '9', label: 'Villes de formation', icon: 'location' as const },
  ];

  const services = [
    {
      title: 'Formation Pratique',
      subtitle: 'Hygiène & Stérilisation Dentaire',
      description: 'Formation complète en collaboration avec les URPS',
      icon: 'school' as const,
      color: 'MedicalTheme.primary',
    },
    {
      title: 'Ateliers Pratiques',
      subtitle: '20 participants maximum',
      description: 'Mises en situation sur matériel professionnel',
      icon: 'construct' as const,
      color: '#34C759',
    },
    {
      title: 'Questionnaire Numérique',
      subtitle: '50 questions spécialisées',
      description: 'Évaluation des risques infectieux au cabinet',
      icon: 'clipboard' as const,
      color: '#FF9500',
    },
  ];

  const workshops = [
    { title: 'PRÉ-DÉSINFECTION', icon: 'water' as const },
    { title: 'NETTOYAGE', icon: 'brush' as const },
    { title: 'CONDITIONNEMENT', icon: 'cube' as const },
    { title: 'STÉRILISATION', icon: 'shield-checkmark' as const },
    { title: 'TRAÇABILITÉ', icon: 'analytics' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo.jpg')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>
            Formateur en{'\n'}
            <Text style={styles.heroTitleHighlight}>Hygiène & Stérilisation Dentaire</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Analyse des Pratiques professionnelles
          </Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {statistics.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name={stat.icon} size={24} color="MedicalTheme.primary" />
                </View>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FORMATIONS</Text>
          <Text style={styles.sectionSubtitle}>
            Organisées en collaboration avec l'URPS de Normandie, l'URPS / PACA et l'URPS / OCÉAN INDIEN
          </Text>
          
          {services.map((service, index) => (
            <TouchableOpacity key={index} style={styles.serviceCard}>
              <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
                <Ionicons name={service.icon} size={32} color={service.color} />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Workshops Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LES ATELIERS</Text>
          <Text style={styles.workshopDescription}>
            Cette journée de formation portera principalement sur l'organisation d'une salle de stérilisation,
            la chaîne de préparation à la stérilisation, les protocoles, l'archivage, le nettoyage des salles
            et des fauteuils, les affichages réglementaires...
          </Text>
          
          <View style={styles.workshopsGrid}>
            {workshops.map((workshop, index) => (
              <View key={index} style={styles.workshopCard}>
                <View style={styles.workshopIcon}>
                  <Ionicons name={workshop.icon} size={28} color="MedicalTheme.primary" />
                </View>
                <Text style={styles.workshopTitle}>{workshop.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quote Section */}
        <View style={styles.quoteSection}>
          <Ionicons name="quote" size={32} color="MedicalTheme.primary" style={styles.quoteIcon} />
          <Text style={styles.quoteText}>
            "La formation est le moyen le plus sûr de développer et d'améliorer vos compétences et vos connaissances."
          </Text>
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
  heroSection: {
    backgroundColor: MedicalTheme.surface,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    }),
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 120,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 6 },
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    }),
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: MedicalTheme.textPrimary,
    marginBottom: 10,
    lineHeight: 32,
  },
  heroTitleHighlight: {
    color: MedicalTheme.primary,
  },
  heroSubtitle: {
    fontSize: 16,
    color: MedicalTheme.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
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
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'MedicalTheme.primary',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  serviceCard: {
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
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: 'MedicalTheme.primary',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  workshopDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  workshopsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workshopCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
  workshopIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  workshopTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  quoteSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
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
  quoteIcon: {
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;
