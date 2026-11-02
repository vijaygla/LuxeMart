import { Product } from './product.model';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  time?: string;
  suggested_products?: Product[];
}

export interface ChatResponse {
  reply: string;
  model_used: string;
  suggested_products?: Product[];
}

export interface AvailableModelsResponse {
  models: string[];
  default_model: string;
}
