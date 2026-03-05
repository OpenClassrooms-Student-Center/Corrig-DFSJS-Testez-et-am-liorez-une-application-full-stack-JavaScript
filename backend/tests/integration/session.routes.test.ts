import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/prisma';
import { generateToken } from '../../src/utils/jwt.util';

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

describe('Session Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/session', () => {
    it('should return sessions when authenticated', async () => {
      mockPrisma.session.findMany.mockResolvedValue([mockSession]);

      const res = await request(app)
        .get('/api/session')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/session');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/session/:id', () => {
    it('should return a session by id', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);

      const res = await request(app)
        .get('/api/session/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Yoga Vinyasa');
    });

    it('should return 404 when session not found', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/session/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/session', () => {
    it('should create a session with valid data and admin role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.teacher.findUnique.mockResolvedValue(mockSession.teacher);
      mockPrisma.session.create.mockResolvedValue(mockSession);

      const res = await request(app)
        .post('/api/session')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Session', date: '2026-03-01', description: 'A new session', teacherId: 1 });

      expect(res.status).toBe(201);
    });

    it('should return 400 for invalid session data', async () => {
      const res = await request(app)
        .post('/api/session')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'AB' });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/session/:id', () => {
    it('should update a session', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.session.update.mockResolvedValue({ ...mockSession, name: 'Updated' });

      const res = await request(app)
        .put('/api/session/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Session' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/session/:id', () => {
    it('should delete a session', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.session.delete.mockResolvedValue(mockSession);

      const res = await request(app)
        .delete('/api/session/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
