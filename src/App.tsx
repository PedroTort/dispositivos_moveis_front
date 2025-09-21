import React from 'react';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

// Definindo um tipo para o produto para que o RootStackParamList seja válido
type Product = {
  productId: string;
};

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Details: {product: Product};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;