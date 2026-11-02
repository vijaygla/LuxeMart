export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Customer' | string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
