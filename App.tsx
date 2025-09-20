import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import FormationScreen from './src/screens/FormationScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import ContactScreen from './src/screens/ContactScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MedicalTheme from './src/theme/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Formation') {
              iconName = focused ? 'school' : 'school-outline';
            } else if (route.name === 'Documents') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Contact') {
              iconName = focused ? 'mail' : 'mail-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'ellipse';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: MedicalTheme.primary,
          tabBarInactiveTintColor: MedicalTheme.textSecondary,
          tabBarStyle: {
            backgroundColor: MedicalTheme.surface,
            borderTopColor: MedicalTheme.border,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerStyle: {
            backgroundColor: MedicalTheme.primary,
            elevation: 4,
            shadowOpacity: 0.1,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: MedicalTheme.textOnPrimary,
            fontSize: 18,
          },
          headerTintColor: MedicalTheme.textOnPrimary,
        })}
      >
        <Tab.Screen 
          name="Accueil" 
          component={HomeScreen}
          options={{ headerTitle: "C ta Pratique" }}
        />
        <Tab.Screen 
          name="Formation" 
          component={FormationScreen}
          options={{ headerTitle: "C ta Pratique" }}
        />
        <Tab.Screen 
          name="Documents" 
          component={DocumentsScreen}
          options={{ headerTitle: "C ta Pratique" }}
        />
        <Tab.Screen 
          name="Contact" 
          component={ContactScreen}
          options={{ headerTitle: "C ta Pratique" }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen}
          options={{ headerTitle: "C ta Pratique" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
