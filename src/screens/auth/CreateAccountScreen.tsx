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

type AuthStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
};

type CreateAccountScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'CreateAccount'>;
};

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await register(name, email, password);

      Alert.alert(
        'Conta Criada!',
        'Sua conta foi criada com sucesso. Por favor, faça o login.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      Alert.alert('Erro no Registro', 'Não foi possível criar a conta. Verifique se o e-mail já está em uso e tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Criar Conta</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Registrar</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: '#374151',
  },
  registerButton: {
    backgroundColor: '#22C55E',
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
    fontSize: 18,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#3B82F6',
    textAlign: 'center',
  },
});

export default CreateAccountScreen;