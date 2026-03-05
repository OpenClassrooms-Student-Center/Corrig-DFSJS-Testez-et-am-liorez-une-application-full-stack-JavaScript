import { describe, it, expect, beforeEach } from 'vitest';
import { useAuth } from '../../src/hooks/useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return not authenticated when no token', () => {
    const result = useAuth();
    expect(result.isAuthenticated).toBe(false);
    expect(result.user).toBeNull();
  });

  it('should return authenticated when token exists', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'valid-token' }));

    const result = useAuth();
    expect(result.isAuthenticated).toBe(true);
    expect(result.user?.email).toBe('test@test.com');
  });

  it('should detect admin user', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'admin@test.com', firstName: 'Admin', lastName: 'User', admin: true, token: 'valid-token' }));

    const result = useAuth();
    expect(result.isAdmin).toBe(true);
  });

  it('should provide logout function', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, admin: false }));

    const result = useAuth();
    result.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
