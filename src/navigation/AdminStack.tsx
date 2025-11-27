import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AddProductScreen from '../screens/admin/AddProductScreen';
import AddCategoryScreen from '../screens/admin/AddCategoryScreen';
import EditProductScreen from '../screens/admin/EditProductScreen';
import { Product } from '../types';

export type AdminStackParamList = {
  AdminHome: undefined;
  AddProduct: { onGoBack: () => void }; 
  AddCategory: { onGoBack: () => void }; 
  EditProduct: { product: Product; onGoBack: () => void }; 
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Adicionar Novo Produto' }} />
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ title: 'Adicionar Nova Categoria' }} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ title: 'Editar Produto' }} />
    </Stack.Navigator>
  );
};

export default AdminStack;