import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../src/pages/Profile';
import { userService } from '../../src/services/user.service';
import { authService } from '../../src/services/auth.service';

vi.mock('../../src/services/user.service', () => ({
  userService: {
    getById: vi.fn(),
    delete: vi.fn(),
    promoteSelfToAdmin: vi.fn(),
  },
}));

vi.mock('../../src/services/auth.service', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    getToken: vi.fn(),
    isAuthenticated: vi.fn(),
    logout: vi.fn(),
    updateCurrentUser: vi.fn(),
  },
}));

const mockUserService = vi.mocked(userService);
const mockAuthService = vi.mocked(authService);

const mockUser = {
  id: 1,
  email: 'user@test.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const renderProfile = () => render(
  <BrowserRouter>
    <Profile />
  </BrowserRouter>,
);

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'user@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'token' });
    mockAuthService.getToken.mockReturnValue('token');
  });

  it('should show loading state', () => {
    mockUserService.getById.mockReturnValue(new Promise(() => {}));
    renderProfile();

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('should display user information', async () => {
    mockUserService.getById.mockResolvedValue(mockUser);
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });
  });

  it('should show User badge for regular users', async () => {
    mockUserService.getById.mockResolvedValue(mockUser);
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  it('should show Administrator badge for admin users', async () => {
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'admin@test.com', firstName: 'Admin', lastName: 'User', admin: true, token: 'token' });
    mockUserService.getById.mockResolvedValue({ ...mockUser, admin: true });
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });
  });

  it('should call delete on account deletion', async () => {
    mockUserService.getById.mockResolvedValue(mockUser);
    mockUserService.delete.mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Delete Account')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Account'));

    await waitFor(() => {
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });

  it('should show error state on fetch failure', async () => {
    mockUserService.getById.mockRejectedValue(new Error('Network error'));
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Failed to load user information')).toBeInTheDocument();
    });
  });
});
