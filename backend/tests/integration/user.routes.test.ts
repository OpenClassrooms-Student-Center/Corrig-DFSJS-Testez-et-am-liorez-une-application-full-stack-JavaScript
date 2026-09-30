import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../../src/prisma';
import { generateToken } from '../../src/utils/jwt.util';
import { startTestServer, stopTestServer } from '../helpers/test-server';

const mockPrisma = vi.mocked(prisma);

const token = generateToken(1);

const mockUser = {
  id: 1,
  email: 'user@test.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
  password: 'hashed',
  createdAt: new Date(),
  updatedAt: new Date(),
};

let baseUrl: string;

describe('User Routes', () => {
  beforeAll(async () => {
    baseUrl = await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/user/:id', () => {
    it('should return user info when authenticated', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await fetch(`${baseUrl}/api/user/1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.email).toBe('user@test.com');
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete own account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const response = await fetch(`${baseUrl}/api/user/1`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);
    });

    it('should return 403 when deleting another user', async () => {
      const response = await fetch(`${baseUrl}/api/user/2`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(403);
    });
  });

  describe('Unauthenticated access', () => {
    it('should return 401 without token', async () => {
      const response = await fetch(`${baseUrl}/api/user/1`);

      expect(response.status).toBe(401);
    });
  });
});
