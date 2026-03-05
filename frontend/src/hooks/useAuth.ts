import { authService } from '../services/auth.service';
import { AuthResponse } from '../types';

export function useAuth() {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = user?.admin ?? false;

  return {
    user,
    isAuthenticated,
    isAdmin,
    login: authService.login,
    register: authService.register,
    logout: authService.logout,
  } as const;
}

export type UseAuthReturn = {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: typeof authService.login;
  register: typeof authService.register;
  logout: typeof authService.logout;
};
