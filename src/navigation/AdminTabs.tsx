import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminStack from './AdminStack'; // Importando o novo Stack Navigator
import ProfileScreen from '../screens/user/ProfileScreen';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'GerenciarStack') iconName = '⚙️';
          else if (route.name === 'Profile') iconName = '👤';
          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#EF4444',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Oculta o header da TabNavigator
      })}>
      <Tab.Screen
        name="GerenciarStack"
        component={AdminStack} // Usando o AdminStack aqui
        options={{ title: 'Gerenciar' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil', headerShown: true }} // Mostra o header na tela de perfil se desejar
      />
    </Tab.Navigator>
  );
};

export default AdminTabs;