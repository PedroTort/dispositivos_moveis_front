import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AddProductScreen from '../screens/admin/AddProductScreen';
import { Product } from '../types';

export type AdminStackParamList = {
  AdminHome: undefined;
  AddProduct: {
    addProduct: (newProduct: Product) => void;
  };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: 'Adicionar Novo Produto' }}
      />
    </Stack.Navigator>
  );
};

export default AdminStack;