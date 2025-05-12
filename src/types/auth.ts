
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
}
