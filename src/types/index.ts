export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}
export interface Category {
  id: number;
  name: string;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  category_id: number;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
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
  decreaseCartItem: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
export type LoginPayload = Pick<User, 'email' | 'password'>;
export type RegisterPayload = Pick<User, 'name' | 'email' | 'password'>;
export type NewProductPayload = Omit<Product, 'id'>;

// CORREÇÃO AQUI: O payload de atualização agora permite que qualquer campo seja enviado
export type UpdateProductPayload = Partial<Omit<Product, 'id'>>;

export type CheckoutPayload = {
  items: { productId: number; quantity: number }[];
};
export type NewCategoryPayload = { name: string };
