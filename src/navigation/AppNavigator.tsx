// src/navigation/AppNavigator.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import UserTabs from './UserTabs';
import AdminTabs from './AdminTabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AppNavigator = () => {
  const { user } = useAuth();

  // Opcional: Você pode querer adicionar um estado de "carregando" no seu AuthContext 
  // para evitar um flash de tela ao abrir o app. Por enquanto, vamos direto ao ponto.
  
  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <>
      {user ? (
        // Se há um usuário logado, verifica o papel (role)
        user.role === 'admin' ? <AdminTabs /> : <UserTabs />
      ) : (
        // Se não há usuário, mostra as telas de autenticação
        <AuthStack />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;