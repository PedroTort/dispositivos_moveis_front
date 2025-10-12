export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  categoryId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
}

export interface CartContextType {
  items: CartItem[];
  // Correção: A assinatura agora aceita uma quantidade opcional
  addToCart: (product: Product, quantity?: number) => void;
  decreaseCartItem: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}