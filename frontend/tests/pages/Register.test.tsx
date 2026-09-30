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

const getInput = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the registration form', () => {
    renderRegister();

    expect(screen.getByText('Register for Yoga Studio')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should update form fields on change', () => {
    renderRegister();

    const firstNameInput = getInput('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane', name: 'firstName' } });
    expect(firstNameInput.value).toBe('Jane');
  });

  it('should call register on form submit', async () => {
    mockAuthService.register.mockResolvedValue({ id: 1, email: 'new@test.com', firstName: 'Jane', lastName: 'Doe', admin: false, token: 'token' });

    renderRegister();

    fireEvent.change(getInput('First Name'), { target: { value: 'Jane', name: 'firstName' } });
    fireEvent.change(getInput('Last Name'), { target: { value: 'Doe', name: 'lastName' } });
    fireEvent.change(getInput('Email'), { target: { value: 'jane@test.com', name: 'email' } });
    fireEvent.change(getInput('Password'), { target: { value: 'password123', name: 'password' } });
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

    fireEvent.change(getInput('First Name'), { target: { value: 'Jane', name: 'firstName' } });
    fireEvent.change(getInput('Last Name'), { target: { value: 'Doe', name: 'lastName' } });
    fireEvent.change(getInput('Email'), { target: { value: 'existing@test.com', name: 'email' } });
    fireEvent.change(getInput('Password'), { target: { value: 'password123', name: 'password' } });
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
