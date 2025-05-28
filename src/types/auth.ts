
export interface User {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
}

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};
