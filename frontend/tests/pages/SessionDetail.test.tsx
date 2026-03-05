import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SessionDetail from '../../src/pages/SessionDetail';
import { sessionService } from '../../src/services/session.service';
import { authService } from '../../src/services/auth.service';

vi.mock('../../src/services/session.service', () => ({
  sessionService: {
    getById: vi.fn(),
    participate: vi.fn(),
    unparticipate: vi.fn(),
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

const mockSession = {
  id: 1,
  name: 'Yoga Vinyasa',
  date: '2026-02-15',
  description: 'A great session for all levels',
  teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
  users: [2],
};

const renderSessionDetail = () => render(
  <MemoryRouter initialEntries={['/sessions/1']}>
    <Routes>
      <Route path="/sessions/:id" element={<SessionDetail />} />
      <Route path="/sessions" element={<div>Sessions List</div>} />
    </Routes>
  </MemoryRouter>,
);

describe('SessionDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService.getCurrentUser.mockReturnValue({ id: 1, email: 'user@test.com', firstName: 'John', lastName: 'Doe', admin: false, token: 'token' });
    mockAuthService.getToken.mockReturnValue('token');
  });

  it('should show loading state', () => {
    mockSessionService.getById.mockReturnValue(new Promise(() => {}));
    renderSessionDetail();

    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });

  it('should display session details', async () => {
    mockSessionService.getById.mockResolvedValue(mockSession);
    renderSessionDetail();

    await waitFor(() => {
      expect(screen.getByText('Yoga Vinyasa')).toBeInTheDocument();
      expect(screen.getByText(/Margot/)).toBeInTheDocument();
      expect(screen.getByText('A great session for all levels')).toBeInTheDocument();
    });
  });

  it('should show Join Session button when not participating', async () => {
    mockSessionService.getById.mockResolvedValue(mockSession);
    renderSessionDetail();

    await waitFor(() => {
      expect(screen.getByText('Join Session')).toBeInTheDocument();
    });
  });

  it('should show Leave Session button when already participating', async () => {
    mockSessionService.getById.mockResolvedValue({ ...mockSession, users: [1] });
    renderSessionDetail();

    await waitFor(() => {
      expect(screen.getByText('Leave Session')).toBeInTheDocument();
    });
  });

  it('should call participate when clicking Join Session', async () => {
    mockSessionService.getById.mockResolvedValue(mockSession);
    mockSessionService.participate.mockResolvedValue(undefined);

    renderSessionDetail();

    await waitFor(() => {
      expect(screen.getByText('Join Session')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Join Session'));

    await waitFor(() => {
      expect(mockSessionService.participate).toHaveBeenCalledWith(1, 1);
    });
  });

  it('should show error state on fetch failure', async () => {
    mockSessionService.getById.mockRejectedValue(new Error('Network error'));
    renderSessionDetail();

    await waitFor(() => {
      expect(screen.getByText('Failed to load session details')).toBeInTheDocument();
    });
  });
});
