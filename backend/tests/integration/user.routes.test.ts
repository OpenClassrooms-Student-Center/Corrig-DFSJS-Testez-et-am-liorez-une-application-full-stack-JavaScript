import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/prisma';
import { generateToken } from '../../src/utils/jwt.util';

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

describe('User Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/user/:id', () => {
    it('should return user info when authenticated', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/user/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('user@test.com');
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete own account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const res = await request(app)
        .delete('/api/user/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('should return 403 when deleting another user', async () => {
      const res = await request(app)
        .delete('/api/user/2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Unauthenticated access', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/user/1');
      expect(res.status).toBe(401);
    });
  });
});
