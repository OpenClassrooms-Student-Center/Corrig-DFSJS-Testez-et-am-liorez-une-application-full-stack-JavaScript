import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';
import { authService } from '../../src/services/auth.service';

vi.mock('../../src/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    getToken: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockAuthService = vi.mocked(authService);

const renderLogin = () => render(
  <BrowserRouter>
    <Login />
  </BrowserRouter>,
);

const getEmailInput = () => screen.getByRole('textbox') as HTMLInputElement;
const getPasswordInput = () => document.querySelector('input[type="password"]') as HTMLInputElement;
const getSubmitButton = () => screen.getByRole('button', { name: /login|loading/i });

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form', () => {
    renderLogin();

    expect(screen.getByText('Login to Yoga Studio')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call login on form submit', async () => {
    mockAuthService.login.mockResolvedValue({ id: 1, email: 'test@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'token' });

    renderLogin();

    fireEvent.change(getEmailInput(), { target: { value: 'test@test.com' } });
    fireEvent.change(getPasswordInput(), { target: { value: 'password123' } });
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
    });
  });

  it('should display error message on login failure', async () => {
    mockAuthService.login.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderLogin();

    fireEvent.change(getEmailInput(), { target: { value: 'wrong@test.com' } });
    fireEvent.change(getPasswordInput(), { target: { value: 'wrong' } });
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    let resolveLogin: (value: unknown) => void;
    const loginPromise = new Promise((resolve) => { resolveLogin = resolve; });
    mockAuthService.login.mockReturnValue(loginPromise as ReturnType<typeof authService.login>);

    renderLogin();

    fireEvent.change(getEmailInput(), { target: { value: 'test@test.com' } });
    fireEvent.change(getPasswordInput(), { target: { value: 'password123' } });
    fireEvent.click(getSubmitButton());

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    resolveLogin!({ id: 1, token: 'token' });
  });

  it('should have a link to register page', () => {
    renderLogin();

    expect(screen.getByText('Register here')).toBeInTheDocument();
  });
});
