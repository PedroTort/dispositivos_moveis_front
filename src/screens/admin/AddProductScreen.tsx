import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { AdminStackParamList } from '../../navigation/AdminStack';
import { Product } from '../../types';
import { categories } from '../../data/mockData'; // Importamos as categorias

type Props = NativeStackScreenProps<AdminStackParamList, 'AddProduct'>;

const AddProductScreen: React.FC<Props> = ({ route, navigation }) => {
  const { addProduct } = route.params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  // Define a primeira categoria como padrão ao carregar a tela
  useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, []);

  const handleSaveProduct = () => {
    if (!name || !price || !stock || !categoryId || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const priceNumber = parseFloat(price.replace(',', '.')); // Aceita vírgula e ponto
    const stockNumber = parseInt(stock, 10);

    if (isNaN(priceNumber) || priceNumber <= 0 || isNaN(stockNumber) || stockNumber < 0) {
      Alert.alert('Erro', 'Preço e estoque devem ser números válidos.');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      price: priceNumber,
      description,
      stock: stockNumber,
      imageUrl: imageUrl || 'https://via.placeholder.com/200', // Placeholder
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
          placeholder="Ex: 39,99"
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

        <Text style={styles.label}>Categoria</Text>
        {/* Container para o Picker ter a mesma aparência dos inputs no Android */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(itemValue) => setCategoryId(itemValue)}
            style={styles.picker}
          >
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  picker: {
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