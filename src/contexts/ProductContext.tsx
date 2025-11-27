import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import * as api from '../services/api';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  updateProductStock: (productId: string, quantitySold: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await api.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductStock = (productId: string, quantitySold: number) => {
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === productId
          ? { ...product, stock: product.stock - quantitySold }
          : product
      )
    );
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, fetchProducts, updateProductStock }}>
      {children}
    </ProductContext.Provider>
  );
};