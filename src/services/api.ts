import { BASE_URL } from '../config/apiConfig';
import { 
  Product, 
  User, 
  CartItem, 
  Category, 
  LoginPayload, 
  RegisterPayload, 
  NewProductPayload, 
  UpdateProductPayload, 
  CheckoutPayload,
  NewCategoryPayload
} from '../types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) {
    return {};
  }
  return response.json();
};

// --- Autenticação ---
export const loginUser = async (credentials: LoginPayload): Promise<{ access_token: string, user: User }> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const registerUser = async (userData: RegisterPayload): Promise<User> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// --- Rotas Públicas ---
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`);
  return handleResponse(response);
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/categories`);
  return handleResponse(response);
};

// --- Rotas Protegidas ---
export const addProduct = async (productData: NewProductPayload, token: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const addCategory = async (categoryData: NewCategoryPayload, token: string): Promise<Category> => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(categoryData),
  });
  return handleResponse(response);
};

export const updateProduct = async (productId: string, productData: UpdateProductPayload, token: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const deleteProduct = async (productId: string, token: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  await handleResponse(response);
};

export const finalizePurchase = async (cartItems: CartItem[], token: string): Promise<{ message: string }> => {
  const payload: CheckoutPayload = {
    items: cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  };
  const response = await fetch(`${BASE_URL}/orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};