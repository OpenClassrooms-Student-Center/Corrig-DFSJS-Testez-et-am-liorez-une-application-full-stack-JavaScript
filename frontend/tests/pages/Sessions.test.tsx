import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sessions from '../../src/pages/Sessions';
import { sessionService } from '../../src/services/session.service';
import { authService } from '../../src/services/auth.service';

vi.mock('../../src/services/session.service', () => ({
  sessionService: {
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../src/services/auth.service', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    getToken: vi.fn(),
    isAuthenticated: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockSessionService = vi.mocked(sessionService);
const mockAuthService = vi.mocked(authService);

const mockSessions = [
  {
    id: 1,
    name: 'Yoga Vinyasa',
    date: '2026-02-15',
    description: 'A great session',
    teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
    users: [1, 2],
  },
  {
    id: 2,
    name: 'Yoga Hatha',
    date: '2026-02-20',
    description: 'Relaxing session',
    teacher: { id: 2, firstName: 'Hélène', lastName: 'Thiercelin' },
    users: [],
  },
];

const renderSessions = () => render(
  <BrowserRouter>
    <Sessions />
  </BrowserRouter>,
);

describe('Sessions Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'user@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'token' });
    mockAuthService.getToken.mockReturnValue('token');
  });

  it('should show loading state', () => {
    mockSessionService.getAll.mockReturnValue(new Promise(() => {}));
    renderSessions();

    expect(screen.getByText('Loading sessions...')).toBeInTheDocument();
  });

  it('should display sessions list', async () => {
    mockSessionService.getAll.mockResolvedValue(mockSessions);
    renderSessions();

    await waitFor(() => {
      expect(screen.getByText('Yoga Vinyasa')).toBeInTheDocument();
      expect(screen.getByText('Yoga Hatha')).toBeInTheDocument();
    });
  });

  it('should show empty state when no sessions', async () => {
    mockSessionService.getAll.mockResolvedValue([]);
    renderSessions();

    await waitFor(() => {
      expect(screen.getByText('No sessions available')).toBeInTheDocument();
    });
  });

  it('should show error state on fetch failure', async () => {
    mockSessionService.getAll.mockRejectedValue(new Error('Network error'));
    renderSessions();

    await waitFor(() => {
      expect(screen.getByText('Failed to load sessions')).toBeInTheDocument();
    });
  });

  it('should show delete button for admin users', async () => {
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'admin@test.com', firstName: 'Admin', lastName: 'User', admin: true, token: 'token' });
    mockSessionService.getAll.mockResolvedValue(mockSessions);
    renderSessions();

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons).toHaveLength(2);
    });
  });

  it('should call delete on confirm', async () => {
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'admin@test.com', firstName: 'Admin', lastName: 'User', admin: true, token: 'token' });
    mockSessionService.getAll.mockResolvedValue(mockSessions);
    mockSessionService.delete.mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderSessions();

    await waitFor(() => {
      expect(screen.getByText('Yoga Vinyasa')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(mockSessionService.delete).toHaveBeenCalledWith(1);
    });
  });
});
