// src/data/mockData.ts
import { Category, Product, User } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Roupas' },
  { id: '3', name: 'Livros' },
  { id: '4', name: 'Casa & Jardim' },
  { id: '5', name: 'Esportes' }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy',
    price: 1299.99,
    description: 'Smartphone moderno com excelente qualidade',
    stock: 15,
    imageUrl: 'https://picsum.photos/200/200?random=1',
    categoryId: '1'
  },
  {
    id: '2',
    name: 'Notebook Dell',
    price: 2499.99,
    description: 'Notebook para trabalho e estudos',
    stock: 8,
    imageUrl: 'https://picsum.photos/200/200?random=2',
    categoryId: '1'
  },
  {
    id: '3',
    name: 'Camiseta Básica',
    price: 39.99,
    description: 'Camiseta 100% algodão, muito confortável',
    stock: 50,
    imageUrl: 'https://picsum.photos/200/200?random=3',
    categoryId: '2'
  },
];

export const users: User[] = [
  {
    id: '1',
    email: 'admin@admin.com',
    password: 'admin',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@user.com',
    password: 'user',
    name: 'John Doe',
    role: 'user'
  },
  {
    id: '3',
    email: 'maria@teste.com',
    password: '123456',
    name: 'Maria Silva',
    role: 'user'
  }
];