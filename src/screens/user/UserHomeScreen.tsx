import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CategoryButton from '../../components/CategoryButton';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { UserTabsParamList } from '../../navigation/UserTabs';
import { Product, Category } from '../../types';
import * as api from '../../services/api';

type HomeScreenProps = {
  navigation: BottomTabNavigationProp<UserTabsParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { getTotalItems, addToCart } = useCart();
  const { products, isLoading: isLoadingProducts } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await api.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as categorias.");
      }
    };
    fetchCategories();
  }, []);

  // 2. Lógica de filtro combinada: aplica o filtro de categoria e depois o de busca
  const filteredProducts = products
    .filter(product => {
      if (selectedCategoryId) {
        return product.category_id === selectedCategoryId;
      }
      return true; 
    })
    .filter(product => {
      if (searchQuery.trim() !== '') {
        return product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      }
      return true;
    });

  const openQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity('1');
    setModalVisible(true);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity <= 0 || numQuantity > selectedProduct.stock) {
      Alert.alert('Quantidade Inválida', `Por favor, insira uma quantidade válida (1 a ${selectedProduct.stock}).`);
      return;
    }
    addToCart(selectedProduct, numQuantity);
    setModalVisible(false);
    Alert.alert('Sucesso!', `${numQuantity} unidade(s) de ${selectedProduct.name} adicionada(s) ao carrinho.`);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIconText}>🛒</Text>
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{getTotalItems()}</Text></View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, getTotalItems]);

  if (isLoadingProducts) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nossa Loja</Text>
        
        {/* 3. Novo TextInput para a barra de busca */}
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar produto pelo nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScrollView}>
          <TouchableOpacity
            style={[styles.categoryButtonBase, selectedCategoryId === null ? styles.categoryButtonSelected : styles.categoryButton]}
            onPress={() => setSelectedCategoryId(null)}
          >
            <Text style={[styles.categoryTextBase, selectedCategoryId === null ? styles.categoryTextSelected : styles.categoryText]}>Todos</Text>
          </TouchableOpacity>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategoryId === category.id}
              onPress={() => setSelectedCategoryId(category.id)}
            />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} onAddToCart={openQuantityModal} />}
        contentContainerStyle={styles.productList}
      />
      {selectedProduct && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione a Quantidade</Text>
              <Text style={styles.modalProduct}>{selectedProduct.name}</Text>
              <Text style={styles.modalStock}>Estoque: {selectedProduct.stock}</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={quantity} onChangeText={setQuantity} autoFocus={true} />
              <View style={styles.modalButtonContainer}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#EF4444" />
                <Button title="Confirmar" onPress={handleConfirmAddToCart} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
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
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  searchBar: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  categoriesScrollView: {
    paddingBottom: 16,
  },
  categoryButtonBase: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 8,
  },
  categoryButton: {
    backgroundColor: '#E5E7EB',
  },
  categoryButtonSelected: {
    backgroundColor: '#3B82F6',
  },
  categoryTextBase: {
    fontWeight: '600',
  },
  categoryText: {
    color: '#374151',
  },
  categoryTextSelected: {
    color: 'white',
  },
  productList: {
    paddingHorizontal: 8,
  },
  cartIconContainer: {
    marginRight: 16,
    position: 'relative',
  },
  cartIconText: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 9999,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalProduct: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#4B5563',
  },
  modalStock: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    color: '#6B7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default HomeScreen;