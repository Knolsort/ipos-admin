import axios from 'axios';
import { Customer, Sale, Product, Shop } from './types';

const BASE_URL = 'https://ipos-api-1.onrender.com/api/v1';

export const api = {
  getCustomers: () => axios.get<Customer[]>(`${BASE_URL}/customers`),
  getSales: () => axios.get<Sale[]>(`${BASE_URL}/sales`),
  getProducts: () => axios.get<Product[]>(`${BASE_URL}/gproducts`),
  getShops: () => axios.get<Shop[]>(`${BASE_URL}/shops`),
};