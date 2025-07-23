import { Order } from '@/types/ai';
import { Product } from '@/types/product';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function processOrderWithAI(orderText: string, menu: Product[]): Promise<Order | null> {
  try {
    const response = await axios.post(`${API_URL}/api/process-order`, {
      orderText,
      menu,
    });

    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.data as Order;
  } catch (error) {
    console.error('Error processing order with AI:', error);
    return null;
  }
}
