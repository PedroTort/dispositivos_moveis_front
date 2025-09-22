// src/navigation/UserTabs.tsx
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/user/UserHomeScreen';
// import CartScreen from '../screens/user/CartScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

export type UserTabsParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<UserTabsParamList>();

const UserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Home') iconName = '🏠';
          else if (route.name === 'Cart') iconName = '🛒';
          else if (route.name === 'Profile') iconName = '👤';
          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#3B82F6', // Cor do ícone ativo
        tabBarInactiveTintColor: 'gray',   // Cor do ícone inativo
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Loja' }} 
      />
      {/* <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'Carrinho' }} 
      /> */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
};

export default UserTabs;