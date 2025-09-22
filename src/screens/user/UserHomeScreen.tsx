import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { products, categories } from '../../data/mockData';
import ProductCard from '../../components/ProductCard';
import CategoryButton from '../../components/CategoryButton';
import { useCart } from '../../contexts/CartContext';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type UserTabsParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

type HomeScreenProps = {
  navigation: BottomTabNavigationProp<UserTabsParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { getTotalItems } = useCart();

  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.categoryId === selectedCategoryId)
    : products;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartIconText}>🛒</Text>
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {getTotalItems()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, getTotalItems]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nossa Loja</Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
        >
          <TouchableOpacity
            style={[
              styles.categoryButtonBase,
              selectedCategoryId === null ? styles.categoryButtonSelected : styles.categoryButton,
            ]}
            onPress={() => setSelectedCategoryId(null)}
          >
            <Text style={[
              styles.categoryTextBase,
              selectedCategoryId === null ? styles.categoryTextSelected : styles.categoryText,
            ]}>
              Todos
            </Text>
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
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937', // text-gray-800
  },
  categoriesScrollView: {
    marginBottom: 16,
  },
  categoryButtonBase: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 8,
  },
  categoryButton: {
    backgroundColor: '#E5E7EB', // bg-gray-200
  },
  categoryButtonSelected: {
    backgroundColor: '#3B82F6', // bg-blue-500
  },
  categoryTextBase: {
    fontWeight: '600',
  },
  categoryText: {
    color: '#374151', // text-gray-700
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
    backgroundColor: '#EF4444', // bg-red-500
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
});

export default HomeScreen;