// --- Modelos de Dados Principais ---

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Category {
  id: number; // ID da categoria é um número
  name: string;
}

export interface Product {
  id: number; // ID do produto é um número
  name: string;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  category_id: number; // CORREÇÃO: Alterado para category_id
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type NewCategoryPayload = {
  name: string;
};

// --- Tipos de Contexto ---

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  decreaseCartItem: (productId: number) => void; // ID do produto é número
  removeFromCart: (productId: number) => void; // ID do produto é número
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// --- Tipos de Payload da API (DTOs do Front-end) ---

export type LoginPayload = Pick<User, 'email' | 'password'>;
export type RegisterPayload = Pick<User, 'name' | 'email' | 'password'>;

// CORREÇÃO: Omit e Partial agora refletem a estrutura correta de Product
export type NewProductPayload = Omit<Product, 'id'>;
export type UpdateProductPayload = Partial<Omit<Product, 'id' | 'name' | 'price' | 'description' | 'imageUrl' | 'category_id'>>;

export type CheckoutPayload = {
  items: {
    productId: number; // ID do produto é número
    quantity: number;
  }[];
};