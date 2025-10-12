import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import * as api from '../services/api'; // Importando a camada de API

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>; // Função para recarregar os produtos
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
      // Aqui você poderia adicionar um estado de erro para mostrar na UI
    } finally {
      setIsLoading(false);
    }
  };

  // Busca os produtos assim que o provedor é montado
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