import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  Button,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../../components/ProductCard';
import { Product, Category } from '../../types';
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
  const navigation = useNavigation<AdminHomeScreenNavigationProp>();

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchAllData = async () => {
    fetchProducts();
    try {
      const fetchedCategories = await api.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAllData();
    }, []),
  );

  const handleDeleteProduct = async (productId: string) => {
    if (!token) {
      Alert.alert('Erro', 'Autenticação necessária.');
      return;
    }
    Alert.alert('Confirmar Exclusão', 'Deseja excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteProduct(productId, token);
            Alert.alert('Sucesso', 'Produto excluído!');
            await fetchAllData();
          } catch (error) {
            Alert.alert(
              'Erro',
              `Não foi possível excluir o produto: ${
                error instanceof Error ? error.message : 'Erro desconhecido'
              }`,
            );
          }
        },
      },
    ]);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!token) {
      Alert.alert('Erro', 'Autenticação necessária.');
      return;
    }
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja excluir esta categoria? Apenas categorias sem produtos podem ser excluídas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteCategory(categoryId, token);
              Alert.alert('Sucesso', 'Categoria excluída!');
              await fetchAllData();
            } catch (error) {
              Alert.alert(
                'Erro',
                `Não foi possível excluir a categoria: ${
                  error instanceof Error ? error.message : 'Erro desconhecido'
                }`,
              );
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('AddProduct', { onGoBack: fetchAllData })
          }
        >
          <Text style={styles.buttonText}>Adicionar Novo Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.manageCategoryButton]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.buttonText}>Gerenciar Categorias</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isAdmin={true}
            onEdit={() =>
              navigation.navigate('EditProduct', {
                product: item,
                onGoBack: fetchAllData,
              })
            }
            onDelete={() => handleDeleteProduct(item.id.toString())}
          />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
      <Modal
        visible={isCategoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gerenciar Categorias</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <View style={styles.modalButtonContainer}>
              <Button
                title="Adicionar Nova"
                onPress={() => {
                  setCategoryModalVisible(false);
                  navigation.navigate('AddCategory', {
                    onGoBack: fetchAllData,
                  });
                }}
              />
              <Button
                title="Fechar"
                onPress={() => setCategoryModalVisible(false)}
                color="#888"
              />
            </View>
          </View>
        </View>
      </Modal>
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
  loadingText: { marginTop: 10, fontSize: 16, color: '#6B7280' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  manageCategoryButton: { backgroundColor: '#3B82F6' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  productList: { paddingHorizontal: 8 },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryName: { fontSize: 16 },
  deleteButtonText: { color: 'red', fontWeight: 'bold' },
  modalButtonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
});

export default AdminHomeScreen;
