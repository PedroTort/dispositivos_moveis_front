import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/AdminStack';
import { Product } from '../../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AddProduct'>;

const AddProductScreen: React.FC<Props> = ({ route, navigation }) => {
  const { addProduct } = route.params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSaveProduct = () => {
    if (!name || !price || !stock || !categoryId || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const priceNumber = parseFloat(price);
    const stockNumber = parseInt(stock, 10);

    if (isNaN(priceNumber) || isNaN(stockNumber)) {
      Alert.alert('Erro', 'Preço e quantidade em estoque devem ser números.');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      price: priceNumber,
      description,
      stock: stockNumber,
      imageUrl: imageUrl || 'https://via.placeholder.com/200', // Placeholder se a URL estiver vazia
      categoryId,
    };

    addProduct(newProduct);
    Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Camiseta Básica"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: 100% algodão, confortável"
          multiline
        />

        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Ex: 39.99"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Quantidade em Estoque</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="Ex: 50"
          keyboardType="numeric"
        />

        <Text style={styles.label}>URL da Imagem (Opcional)</Text>
        <TextInput
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://exemplo.com/imagem.jpg"
        />

        <Text style={styles.label}>ID da Categoria</Text>
        <TextInput
          style={styles.input}
          value={categoryId}
          onChangeText={setCategoryId}
          placeholder="Ex: 1 para Eletrônicos, 2 para Roupas"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
          <Text style={styles.saveButtonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddProductScreen;