import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { products as initialProducts } from '../../data/mockData';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';
import { AdminStackParamList } from '../../navigation/AdminStack';

type AdminHomeScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  'AdminHome'
>;

const AdminHomeScreen = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const navigation = useNavigation<AdminHomeScreenNavigationProp>();

  const handleDeleteProduct = (productId: string) => {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
    Alert.alert('Sucesso', 'Produto excluído com sucesso!');
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(product.stock.toString());
    setModalVisible(true);
  };

  const handleUpdateQuantity = () => {
    if (selectedProduct && quantity !== '') {
      const newQuantity = parseInt(quantity, 10);
      if (!isNaN(newQuantity)) {
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === selectedProduct.id ? { ...p, stock: newQuantity } : p
          )
        );
        setModalVisible(false);
        Alert.alert('Sucesso', 'Quantidade atualizada com sucesso!');
      } else {
        Alert.alert('Erro', 'Por favor, insira um número válido.');
      }
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Produtos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct', { addProduct: handleAddProduct })}
        >
          <Text style={styles.addButtonText}>Adicionar Novo Produto</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isAdmin={true}
            onEdit={() => openEditModal(item)}
            onDelete={() => handleDeleteProduct(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />

      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Editar Quantidade de {selectedProduct.name}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <View style={styles.modalButtonContainer}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Salvar" onPress={handleUpdateQuantity} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: '#22C55E',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    productList: {
        paddingHorizontal: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default AdminHomeScreen;