import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../../src/prisma';
import { generateToken } from '../../src/utils/jwt.util';
import { startTestServer, stopTestServer } from '../helpers/test-server';

const mockPrisma = vi.mocked(prisma);

const adminUser = { id: 1, email: 'admin@test.com', firstName: 'Admin', lastName: 'User', admin: true, password: 'hashed', createdAt: new Date(), updatedAt: new Date() };
const token = generateToken(1);

const mockSession = {
  id: 1,
  name: 'Yoga Vinyasa',
  date: new Date('2026-02-15'),
  description: 'A great session',
  teacherId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye', createdAt: new Date(), updatedAt: new Date() },
  participants: [],
};

let baseUrl: string;

describe('Session Routes', () => {
  beforeAll(async () => {
    baseUrl = await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/session', () => {
    it('should return sessions when authenticated', async () => {
      mockPrisma.session.findMany.mockResolvedValue([mockSession]);

      const response = await fetch(`${baseUrl}/api/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveLength(1);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await fetch(`${baseUrl}/api/session`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/session/:id', () => {
    it('should return a session by id', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);

      const response = await fetch(`${baseUrl}/api/session/1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.name).toBe('Yoga Vinyasa');
    });

    it('should return 404 when session not found', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(null);

      const response = await fetch(`${baseUrl}/api/session/999`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/session', () => {
    it('should create a session with valid data and admin role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.teacher.findUnique.mockResolvedValue(mockSession.teacher);
      mockPrisma.session.create.mockResolvedValue(mockSession);

      const response = await fetch(`${baseUrl}/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: 'New Session', date: '2026-03-01', description: 'A new session', teacherId: 1 }),
      });

      expect(response.status).toBe(201);
    });

    it('should return 400 for invalid session data', async () => {
      const response = await fetch(`${baseUrl}/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: 'AB' }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/session/:id', () => {
    it('should update a session', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.session.update.mockResolvedValue({ ...mockSession, name: 'Updated' });

      const response = await fetch(`${baseUrl}/api/session/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: 'Updated Session' }),
      });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/session/:id', () => {
    it('should delete a session', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.session.delete.mockResolvedValue(mockSession);

      const response = await fetch(`${baseUrl}/api/session/1`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);
    });
  });
});
