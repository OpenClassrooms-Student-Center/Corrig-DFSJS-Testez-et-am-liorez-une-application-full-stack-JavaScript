import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/prisma';
import { generateToken } from '../../src/utils/jwt.util';

const mockPrisma = vi.mocked(prisma);

const token = generateToken(1);

const mockTeacher = {
  id: 1,
  firstName: 'Margot',
  lastName: 'Delahaye',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Teacher Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/teacher', () => {
    it('should return teachers when authenticated', async () => {
      mockPrisma.teacher.findMany.mockResolvedValue([mockTeacher]);

      const res = await request(app)
        .get('/api/teacher')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/teacher');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/teacher/:id', () => {
    it('should return 404 when teacher not found', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/teacher/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
