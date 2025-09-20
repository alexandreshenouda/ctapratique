import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MedicalTheme from '../theme/colors';

interface FormationItemProps {
  title: string;
  description: string;
  duration: string;
  participants: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const FormationItem: React.FC<FormationItemProps> = ({
  title,
  description,
  duration,
  participants,
  icon,
  color,
}) => (
  <TouchableOpacity style={styles.formationCard}>
    <View style={[styles.formationIcon, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <View style={styles.formationContent}>
      <Text style={styles.formationTitle}>{title}</Text>
      <Text style={styles.formationDescription}>{description}</Text>
      <View style={styles.formationDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{participants}</Text>
        </View>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

const FormationScreen: React.FC = () => {
  const formations = [
    {
      title: 'Formation URPS Normandie',
      description: 'Formation complète en hygiène et stérilisation dentaire avec ateliers pratiques',
      duration: '1 journée',
      participants: 'Max 20',
      icon: 'school' as const,
      color: 'MedicalTheme.primary',
    },
    {
      title: 'Formation URPS PACA',
      description: 'Session spécialisée pour la région Provence-Alpes-Côte d\'Azur',
      duration: '1 journée',
      participants: 'Max 20',
      icon: 'medical' as const,
      color: '#34C759',
    },
    {
      title: 'Formation URPS Océan Indien',
      description: 'Formation adaptée aux spécificités régionales de l\'Océan Indien',
      duration: '1 journée',
      participants: 'Max 20',
      icon: 'globe' as const,
      color: '#FF9500',
    },
  ];

  const programPoints = [
    'Organisation d\'une salle de stérilisation',
    'Chaîne de préparation à la stérilisation',
    'Protocoles et procédures',
    'Archivage et traçabilité',
    'Nettoyage des salles et fauteuils',
    'Affichages réglementaires',
    'Prévention des infections liées aux soins',
    'Respect des recommandations HAS',
  ];

  const objectives = [
    {
      title: 'Respecter les recommandations',
      description: 'Grille technique pour la prévention des infections liées aux soins',
      icon: 'checkmark-circle' as const,
    },
    {
      title: 'Maîtriser le processus',
      description: 'Stérilisation des dispositifs médicaux critiques et semi-critiques',
      icon: 'settings' as const,
    },
    {
      title: 'Appliquer les règles',
      description: 'Hygiène élémentaires au cabinet dentaire',
      icon: 'shield-checkmark' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Programme de Formation</Text>
          <Text style={styles.headerSubtitle}>
            Analyse des Pratiques professionnelles en Hygiène et Stérilisation Dentaire
          </Text>
        </View>

        {/* Formations Available */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FORMATIONS DISPONIBLES</Text>
          {formations.map((formation, index) => (
            <FormationItem
              key={index}
              title={formation.title}
              description={formation.description}
              duration={formation.duration}
              participants={formation.participants}
              icon={formation.icon}
              color={formation.color}
            />
          ))}
        </View>

        {/* Objectives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBJECTIFS</Text>
          {objectives.map((objective, index) => (
            <View key={index} style={styles.objectiveCard}>
              <View style={styles.objectiveIcon}>
                <Ionicons name={objective.icon} size={24} color="MedicalTheme.primary" />
              </View>
              <View style={styles.objectiveContent}>
                <Text style={styles.objectiveTitle}>{objective.title}</Text>
                <Text style={styles.objectiveDescription}>{objective.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Program Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROGRAMME DÉTAILLÉ</Text>
          <View style={styles.programCard}>
            <Text style={styles.programHeader}>Points abordés durant la formation :</Text>
            {programPoints.map((point, index) => (
              <View key={index} style={styles.programPoint}>
                <Ionicons name="arrow-forward" size={16} color="MedicalTheme.primary" />
                <Text style={styles.programText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Practical Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS PRATIQUES</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color="MedicalTheme.primary" />
              <Text style={styles.infoHeaderText}>Modalités</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <Ionicons name="people" size={16} color="#666" />
                <Text style={styles.infoText}>Maximum 20 participants par session</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="construct" size={16} color="#666" />
                <Text style={styles.infoText}>Ateliers pratiques avec matériel professionnel</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="clipboard" size={16} color="#666" />
                <Text style={styles.infoText}>Questionnaire numérique de 50 questions</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.infoText}>Salles d'exposition des distributeurs régionaux</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Legal References */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RÉFÉRENCES LÉGALES</Text>
          <View style={styles.legalCard}>
            <Text style={styles.legalText}>
              Conformément à l'article L3114-6 du code de la santé publique, aux données acquises 
              de la science prévues à l'article L 1110-5 du code de la santé publique, au référentiel 
              de la Haute Autorité de Santé d'évaluation des centres de santé et au guide de prévention 
              des infections liées aux soins en chirurgie dentaire et en stomatologie.
            </Text>
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
  header: {
    backgroundColor: MedicalTheme.primary,
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MedicalTheme.textOnPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: MedicalTheme.textOnPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MedicalTheme.textPrimary,
    marginBottom: 15,
  },
  formationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MedicalTheme.surface,
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
  formationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  formationContent: {
    flex: 1,
  },
  formationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  formationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  formationDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  objectiveCard: {
    flexDirection: 'row',
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
  objectiveIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  objectiveContent: {
    flex: 1,
  },
  objectiveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  objectiveDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  programCard: {
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
  programHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  programPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  programText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoCard: {
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
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  infoHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  legalCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'MedicalTheme.primary',
  },
  legalText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});

export default FormationScreen;
