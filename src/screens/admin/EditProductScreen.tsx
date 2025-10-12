import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { AdminStackParamList } from '../../navigation/AdminStack';
import { Category, UpdateProductPayload } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import * as api from '../../services/api';

type Props = NativeStackScreenProps<AdminStackParamList, 'EditProduct'>;

const EditProductScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product, onGoBack } = route.params;
  const { token } = useAuth();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [stock, setStock] = useState(product.stock.toString());
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [categoryId, setCategoryId] = useState<number>(product.category_id);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await api.getCategories();
        setCategories(fetchedCategories);
      } catch (error) { Alert.alert("Erro", "Não foi possível carregar as categorias."); }
    };
    fetchCategories();
  }, []);

  const handleSaveChanges = async () => {
    if (!token || !name || !price || !stock || !categoryId || !description) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    setIsLoading(true);

    const payload: UpdateProductPayload = { name, price: parseFloat(price.replace(',', '.')), description, stock: parseInt(stock, 10), imageUrl, category_id: categoryId };

    try {
      await api.updateProduct(product.id.toString(), payload, token);
      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      onGoBack(); // Chama a função de atualização da tela anterior
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro.';
      Alert.alert('Erro', `Não foi possível atualizar o produto: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Descrição</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />
        <Text style={styles.label}>Preço</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
        <Text style={styles.label}>Quantidade em Estoque</Text>
        <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />
        <Text style={styles.label}>URL da Imagem</Text>
        <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={categoryId} onValueChange={(itemValue) => setCategoryId(itemValue)} style={styles.picker}>
            {categories.map((category) => ( <Picker.Item key={category.id} label={category.name} value={category.id} /> ))}
          </Picker>
        </View>
        <TouchableOpacity style={[styles.saveButton, isLoading && styles.buttonDisabled]} onPress={handleSaveChanges} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, color: '#1F2937' },
  pickerContainer: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 16, backgroundColor: 'white', justifyContent: 'center' },
  picker: { color: '#1F2937', height: Platform.OS === 'ios' ? undefined : 50 },
  saveButton: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 16, height: 50, justifyContent: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default EditProductScreen;