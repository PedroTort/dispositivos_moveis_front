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
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { testApiConnection } from '../../services/api';

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
  const { login, isLoading } = useAuth(); // Pegamos o isLoading do contexto

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      // A função de login agora é async
      await login(email, password);
      // Se o login for bem-sucedido, o AppNavigator fará a transição de tela
      // automaticamente, pois o estado 'user' no AuthContext mudou.
    } catch (error) {
      Alert.alert('Erro no Login', 'Email ou senha incorretos. Por favor, tente novamente.');
    }
  };
  
  const handleApiCall = async () => {
    try {
      const data = await testApiConnection();
      Alert.alert('Resposta do Servidor', data.message);
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível se conectar ao servidor.');
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
            editable={!isLoading} // Desabilita o campo durante o carregamento
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.createAccountButtonText}>
              Criar nova conta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.apiButton} onPress={handleApiCall}>
            <Text style={styles.buttonText}>Testar Conexão</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, color: '#1F2937' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, color: '#374151' },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    height: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  createAccountButton: { paddingVertical: 8 },
  createAccountButtonText: { color: '#3B82F6', textAlign: 'center' },
  apiButton: { backgroundColor: '#16A34A', borderRadius: 8, paddingVertical: 12, marginTop: 8, marginBottom: 16, justifyContent: 'center' },
});

export default LoginScreen;