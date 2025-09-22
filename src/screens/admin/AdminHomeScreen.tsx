import React, { useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { products as initialProducts } from '../../data/mockData';
import ProductCard from '../../components/ProductCard';

const AdminHomeScreen: React.FC = () => {
  // Em um app real, isso viria de um estado global ou API
  const [products, setProducts] = useState(initialProducts);

  const handleEdit = (productId: string) => {
    // Lógica para navegar para a tela de edição de produto
    Alert.alert('Editar Produto', `Navegar para a tela de edição do produto ${productId}`);
  };

  const handleDelete = (productId: string) => {
    // Filtra o produto a ser deletado da lista
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    Alert.alert('Sucesso', 'Produto excluído com sucesso!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Produtos</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isAdmin={true}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // border-gray-200
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937', // text-gray-800
  },
  productList: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
});

export default AdminHomeScreen;