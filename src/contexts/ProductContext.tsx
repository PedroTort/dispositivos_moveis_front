import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../data/mockData';

interface ProductContextType {
  products: Product[];
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
  const [products, setProducts] = useState<Product[]>(initialProducts);

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
    <ProductContext.Provider value={{ products, updateProductStock }}>
      {children}
    </ProductContext.Provider>
  );
};