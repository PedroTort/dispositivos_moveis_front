import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const success = login(email, password);
    if (!success) {
      Alert.alert('Erro', 'Email ou senha incorretos');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.createAccountButtonText}>
              Criar nova conta
            </Text>
          </TouchableOpacity>

          <View style={styles.testAccountsContainer}>
            <Text style={styles.testAccountsTitle}>Contas de teste:</Text>
            <Text style={styles.testAccountsText}>Admin: admin@admin.com / admin</Text>
            <Text style={styles.testAccountsText}>User: user@user.com / user</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1F2937', // text-gray-800
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: '#374151', // text-gray-700
  },
  loginButton: {
    backgroundColor: '#3B82F6', // bg-blue-500
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  createAccountButton: {
    paddingVertical: 8,
  },
  createAccountButtonText: {
    color: '#3B82F6', // text-blue-500
    textAlign: 'center',
  },
  testAccountsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F3F4F6', // bg-gray-100
    borderRadius: 8,
  },
  testAccountsTitle: {
    color: '#4B5563', // text-gray-600
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  testAccountsText: {
    color: '#4B5563', // text-gray-600
    fontSize: 12,
  },
});

export default LoginScreen;