import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';
import { authService } from '../../src/services/auth.service';

vi.mock('../../src/services/auth.service', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    isAuthenticated: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn(),
  },
}));

const mockAuthService = vi.mocked(authService);

const renderNavbar = () => render(
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>,
);

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show login and register links when logged out', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockAuthService.getCurrentUser.mockReturnValue(null);

    renderNavbar();

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should show sessions and logout when logged in', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'test@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'token' });

    renderNavbar();

    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should show Create Session link for admin users', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'admin@test.com', firstName: 'Admin', lastName: 'User', admin: true, token: 'token' });

    renderNavbar();

    expect(screen.getByText('Create Session')).toBeInTheDocument();
  });

  it('should call logout when clicking logout button', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'test@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'token' });

    renderNavbar();

    fireEvent.click(screen.getByText('Logout'));
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
