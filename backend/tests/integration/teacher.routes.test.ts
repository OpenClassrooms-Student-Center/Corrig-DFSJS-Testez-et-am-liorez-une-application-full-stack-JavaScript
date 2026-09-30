import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../../src/prisma';
import { generateToken } from '../../src/utils/jwt.util';
import { startTestServer, stopTestServer } from '../helpers/test-server';

const mockPrisma = vi.mocked(prisma);

const token = generateToken(1);

const mockTeacher = {
  id: 1,
  firstName: 'Margot',
  lastName: 'Delahaye',
  createdAt: new Date(),
  updatedAt: new Date(),
};

let baseUrl: string;

describe('Teacher Routes', () => {
  beforeAll(async () => {
    baseUrl = await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/teacher', () => {
    it('should return teachers when authenticated', async () => {
      mockPrisma.teacher.findMany.mockResolvedValue([mockTeacher]);

      const response = await fetch(`${baseUrl}/api/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveLength(1);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await fetch(`${baseUrl}/api/teacher`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/teacher/:id', () => {
    it('should return 404 when teacher not found', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(null);

      const response = await fetch(`${baseUrl}/api/teacher/999`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(404);
    });
  });
});
