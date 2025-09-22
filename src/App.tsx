// App.tsx (ou seu arquivo de entrada principal)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AppNavigator from './navigation/AppNavigator'; 

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;