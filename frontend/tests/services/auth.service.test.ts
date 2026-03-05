import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../src/services/auth.service';
import api from '../../src/services/api';

vi.mock('../../src/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

const mockApi = vi.mocked(api);

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should store token on login', async () => {
    mockApi.post.mockResolvedValue({
      data: { id: 1, email: 'test@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'jwt-token' },
    });

    await authService.login({ email: 'test@test.com', password: 'password' });

    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(localStorage.getItem('user')).toBeTruthy();
  });

  it('should store token on register', async () => {
    mockApi.post.mockResolvedValue({
      data: { id: 1, email: 'new@test.com', firstName: 'Jane', lastName: 'Doe', admin: false, token: 'jwt-token' },
    });

    await authService.register({ email: 'new@test.com', password: 'password123', firstName: 'Jane', lastName: 'Doe' });

    expect(localStorage.getItem('token')).toBe('jwt-token');
  });

  it('should clear storage on logout', () => {
    localStorage.setItem('token', 'jwt-token');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    authService.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should return current user from localStorage', () => {
    const user = { id: 1, email: 'test@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'token' };
    localStorage.setItem('user', JSON.stringify(user));

    const result = authService.getCurrentUser();
    expect(result?.email).toBe('test@test.com');
  });

  it('should return null when no user in localStorage', () => {
    const result = authService.getCurrentUser();
    expect(result).toBeNull();
  });

  it('should check authentication status', () => {
    expect(authService.isAuthenticated()).toBe(false);

    localStorage.setItem('token', 'jwt-token');
    expect(authService.isAuthenticated()).toBe(true);
  });
});
