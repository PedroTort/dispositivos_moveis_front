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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../../components/ProductCard';
import { Product, UpdateProductPayload } from '../../types';
import { AdminStackParamList } from '../../navigation/AdminStack';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import * as api from '../../services/api';

type AdminHomeScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  'AdminHome'
>;

const AdminHomeScreen = () => {
  const { products, isLoading, fetchProducts } = useProducts();
  const { token } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stock, setStock] = useState('');
  const navigation = useNavigation<AdminHomeScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleDeleteProduct = async (productId: string) => {
    if (!token) {
      Alert.alert('Erro', 'Autenticação necessária.');
      return;
    }
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este produto permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteProduct(productId, token);
              Alert.alert('Sucesso', 'Produto excluído!');
              await fetchProducts(); // Recarrega a lista
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
              Alert.alert('Erro', `Não foi possível excluir o produto: ${errorMessage}`);
            }
          },
        },
      ]
    );
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setStock(product.stock.toString());
    setModalVisible(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct || !token) {
      Alert.alert('Erro', 'Produto ou autenticação inválidos.');
      return;
    }
    const newStock = parseInt(stock, 10);
    if (isNaN(newStock) || newStock < 0) {
      Alert.alert('Erro', 'Por favor, insira um número de estoque válido.');
      return;
    }

    const payload: UpdateProductPayload = { stock: newStock };

    try {
      await api.updateProduct(selectedProduct.id.toString(), payload, token);
      setModalVisible(false);
      Alert.alert('Sucesso', 'Estoque atualizado!');
      await fetchProducts(); // Recarrega a lista
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro', `Não foi possível atualizar o estoque: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Produtos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct', { addProduct: () => fetchProducts() })}
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
            onDelete={() => handleDeleteProduct(item.id.toString())}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
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
              <Text style={styles.modalTitle}>Editar Estoque de {selectedProduct.name}</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={stock} onChangeText={setStock} />
              <View style={styles.modalButtonContainer}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Salvar" onPress={handleUpdateStock} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
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