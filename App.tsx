import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import FormationScreen from './src/screens/FormationScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import ContactScreen from './src/screens/ContactScreen';
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
                 headerShown: false,
        })}
      >
        {/* <Tab.Screen 
          name="Accueil" 
          component={HomeScreen}
        /> */}
        {/* <Tab.Screen 
          name="Formation" 
          component={FormationScreen}
        /> */}
        <Tab.Screen 
          name="Documents" 
          component={DocumentsScreen}
        />
        <Tab.Screen 
          name="Contact" 
          component={ContactScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
