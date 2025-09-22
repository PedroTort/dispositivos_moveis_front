// src/screens/user/ProfileScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // 1. Importar o hook useAuth

const ProfileScreen = () => {
  // 2. Obter o usuário logado e a função de logout do nosso contexto
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirmar Saída",
      "Você tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sair", 
          onPress: () => logout(), // 3. Botão que chama a função logout
          style: "destructive"
        }
      ]
    );
  };

  // Se por algum motivo não houver usuário (pouco provável nesta tela), mostra uma mensagem.
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Nenhum usuário logado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil do Usuário</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.info}>{user.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tipo de Conta:</Text>
          <Text style={styles.info}>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair (Logout)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // bg-gray-100
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#6B7280', // text-gray-500
  },
  info: {
    fontSize: 18,
    color: '#111827', // text-gray-900
  },
  logoutButton: {
    backgroundColor: '#EF4444', // bg-red-500
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;