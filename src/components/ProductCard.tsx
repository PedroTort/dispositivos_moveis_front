import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isAdmin = false, 
  onEdit, 
  onDelete 
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
      Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
    } else {
      Alert.alert('Erro', 'Produto fora de estoque!');
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir ${product.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete } 
      ]
    );
  };


  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: product.imageUrl }} 
        style={styles.image}
      />
      
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      
      <Text style={styles.price}>
        R$ {product.price.toFixed(2)}
      </Text>
      
      <Text style={styles.stock}>
        Estoque: {product.stock}
      </Text>

      {isAdmin ? (
        <View style={styles.adminButtonContainer}>
          <TouchableOpacity style={[styles.adminButton, styles.editButton]} onPress={onEdit}>
            <Text style={styles.adminButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.adminButton, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.adminButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.button, product.stock === 0 && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Text style={styles.buttonText}>
            {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    margin: 8,
    padding: 16,
    flex: 1,
    maxWidth: '46%',
  },
  image: {
    width: '100%',
    height: 128,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#1F2937',
    minHeight: 38,
  },
  price: {
    color: '#16A34A',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  stock: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 12,
  },
  // Estilos para o botão do usuário
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  // Estilos para os botões do admin
  adminButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adminButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3B82F6', // Azul
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: '#EF4444', // Vermelho
    marginLeft: 4,
  },
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ProductCard;