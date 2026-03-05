import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../src/pages/Register';
import { authService } from '../../src/services/auth.service';

vi.mock('../../src/services/auth.service', () => ({
  authService: {
    register: vi.fn(),
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    getToken: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockAuthService = vi.mocked(authService);

const renderRegister = () => render(
  <BrowserRouter>
    <Register />
  </BrowserRouter>,
);

const getInput = (name: string) => document.querySelector(`input[name="${name}"]`) as HTMLInputElement;

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the registration form', () => {
    renderRegister();

    expect(screen.getByText('Register for Yoga Studio')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('should update form fields on change', () => {
    renderRegister();

    const firstNameInput = getInput('firstName');
    fireEvent.change(firstNameInput, { target: { value: 'Jane', name: 'firstName' } });
    expect(firstNameInput.value).toBe('Jane');
  });

  it('should call register on form submit', async () => {
    mockAuthService.register.mockResolvedValue({ id: 1, email: 'new@test.com', firstName: 'Jane', lastName: 'Doe', admin: false, token: 'token' });

    renderRegister();

    fireEvent.change(getInput('firstName'), { target: { value: 'Jane', name: 'firstName' } });
    fireEvent.change(getInput('lastName'), { target: { value: 'Doe', name: 'lastName' } });
    fireEvent.change(getInput('email'), { target: { value: 'jane@test.com', name: 'email' } });
    fireEvent.change(getInput('password'), { target: { value: 'password123', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockAuthService.register).toHaveBeenCalled();
    });
  });

  it('should display error on registration failure', async () => {
    mockAuthService.register.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    renderRegister();

    fireEvent.change(getInput('firstName'), { target: { value: 'Jane', name: 'firstName' } });
    fireEvent.change(getInput('lastName'), { target: { value: 'Doe', name: 'lastName' } });
    fireEvent.change(getInput('email'), { target: { value: 'existing@test.com', name: 'email' } });
    fireEvent.change(getInput('password'), { target: { value: 'password123', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('should have a link to login page', () => {
    renderRegister();

    expect(screen.getByText('Login here')).toBeInTheDocument();
  });
});
