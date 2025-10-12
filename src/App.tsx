import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;