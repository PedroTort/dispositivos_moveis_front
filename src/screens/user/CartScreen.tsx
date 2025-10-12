import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext'; // 1. Importar useAuth para pegar o token
import * as api from '../../services/api'; // 2. Importar a camada de API
import { CartItem } from '../../types';

const CartScreen = () => {
  // 3. Pegar as funções necessárias dos contextos (incluindo o token)
  const { items, addToCart, decreaseCartItem, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { fetchProducts } = useProducts();
  const { token } = useAuth();

  // 4. Lógica de finalização de compra atualizada para usar a API
  const handleFinalizePurchase = () => {
    if (!token) {
      Alert.alert('Erro', 'Você precisa estar logado para finalizar a compra.');
      return;
    }
    Alert.alert(
      "Finalizar Compra",
      `O valor total é de R$ ${getTotalPrice().toFixed(2)}. Deseja confirmar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              // Chama a API para finalizar a compra no backend
              await api.finalizePurchase(items, token);
              Alert.alert('Compra Finalizada!', 'Obrigado por comprar conosco.');
              clearCart(); // Limpa o carrinho localmente
              await fetchProducts(); // Atualiza a lista global de produtos
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
              Alert.alert('Erro na Compra', `Não foi possível finalizar a compra: ${errorMessage}`);
              // Recarrega os produtos para garantir que o usuário veja o estoque mais atualizado
              await fetchProducts();
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>R$ {item.product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseCartItem(item.product.id)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => addToCart(item.product)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Meu Carrinho</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.product.id.toString()} // Atualizado para .toString() para garantir que a chave seja uma string
            style={styles.list}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: R$ {getTotalPrice().toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleFinalizePurchase}>
              <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

// Seus estilos foram mantidos exatamente como você forneceu
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    color: '#1F2937',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6B7280',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  itemPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#EF4444',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
    color: '#1F2937',
  },
  checkoutButton: {
    backgroundColor: '#22C55E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;