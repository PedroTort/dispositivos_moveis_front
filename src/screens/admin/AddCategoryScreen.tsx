import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/AdminStack';
import { useAuth } from '../../contexts/AuthContext';
import * as api from '../../services/api';
import { NewCategoryPayload } from '../../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AddCategory'>;

const AddCategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { onGoBack } = route.params;
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSaveCategory = async () => {
    if (!token || !name.trim()) {
      Alert.alert('Erro', 'O nome da categoria é obrigatório.');
      return;
    }
    setIsLoading(true);
    try {
      await api.addCategory({ name: name.trim() }, token);
      Alert.alert('Sucesso', 'Nova categoria adicionada!');
      onGoBack(); 
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro.';
      Alert.alert('Erro', `Não foi possível criar a categoria: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Nova Categoria</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Acessórios" autoFocus />
        <TouchableOpacity style={[styles.saveButton, isLoading && styles.buttonDisabled]} onPress={handleSaveCategory} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Categoria</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 24, color: '#1F2937', fontSize: 16 },
  saveButton: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 8, alignItems: 'center', height: 50, justifyContent: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default AddCategoryScreen;