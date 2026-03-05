import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sessionService } from '../../../src/services/session.service';
import prisma from '../../../src/prisma';
import { NotFoundError, ForbiddenError, ConflictError } from '../../../src/errors/app-error';

const mockPrisma = vi.mocked(prisma);

const mockSession = {
  id: 1,
  name: 'Yoga Vinyasa',
  date: new Date('2026-02-15'),
  description: 'A great session',
  teacherId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye', createdAt: new Date(), updatedAt: new Date() },
  participants: [
    {
      sessionId: 1,
      userId: 1,
      user: { id: 1, email: 'test@test.com', firstName: 'John', lastName: 'Doe', admin: false, password: 'hashed', createdAt: new Date(), updatedAt: new Date() },
    },
  ],
};

const adminUser = { id: 1, email: 'admin@test.com', firstName: 'Admin', lastName: 'User', admin: true, password: 'hashed', createdAt: new Date(), updatedAt: new Date() };
const regularUser = { id: 2, email: 'user@test.com', firstName: 'Regular', lastName: 'User', admin: false, password: 'hashed', createdAt: new Date(), updatedAt: new Date() };

describe('Session Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all sessions', async () => {
      mockPrisma.session.findMany.mockResolvedValue([mockSession]);

      const result = await sessionService.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Yoga Vinyasa');
      expect(result[0].users).toEqual([1]);
    });
  });

  describe('getById', () => {
    it('should return a session by id', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);

      const result = await sessionService.getById(1);
      expect(result.name).toBe('Yoga Vinyasa');
    });

    it('should throw NotFoundError if session does not exist', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(null);

      await expect(sessionService.getById(999)).rejects.toThrow(NotFoundError);
      await expect(sessionService.getById(999)).rejects.toThrow('Session not found');
    });
  });

  describe('create', () => {
    it('should create a session when user is admin', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.teacher.findUnique.mockResolvedValue(mockSession.teacher);
      mockPrisma.session.create.mockResolvedValue({ ...mockSession, participants: [] });

      const result = await sessionService.create(1, {
        name: 'New Session',
        date: '2026-03-01',
        description: 'Description',
        teacherId: 1,
      });
      expect(result.name).toBe('Yoga Vinyasa');
    });

    it('should throw ForbiddenError when user is not admin', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(regularUser);

      await expect(
        sessionService.create(2, { name: 'New', date: '2026-03-01', description: 'Desc', teacherId: 1 }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw NotFoundError when teacher does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.teacher.findUnique.mockResolvedValue(null);

      await expect(
        sessionService.create(1, { name: 'New', date: '2026-03-01', description: 'Desc', teacherId: 999 }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('should update a session when user is admin', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.session.update.mockResolvedValue(mockSession);

      const result = await sessionService.update(1, 1, { name: 'Updated' });
      expect(result.name).toBe('Yoga Vinyasa');
    });
  });

  describe('delete', () => {
    it('should delete a session when user is admin', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.session.delete.mockResolvedValue(mockSession);

      await expect(sessionService.delete(1, 1)).resolves.toBeUndefined();
    });
  });

  describe('participate', () => {
    it('should allow user to join a session', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.user.findUnique.mockResolvedValue(regularUser);
      mockPrisma.sessionParticipation.findUnique.mockResolvedValue(null);
      mockPrisma.sessionParticipation.create.mockResolvedValue({ sessionId: 1, userId: 2 });

      await expect(sessionService.participate(1, 2)).resolves.toBeUndefined();
    });

    it('should throw ConflictError when already participating', async () => {
      mockPrisma.session.findUnique.mockResolvedValue(mockSession);
      mockPrisma.user.findUnique.mockResolvedValue(regularUser);
      mockPrisma.sessionParticipation.findUnique.mockResolvedValue({ sessionId: 1, userId: 2 });

      await expect(sessionService.participate(1, 2)).rejects.toThrow(ConflictError);
    });
  });

  describe('unparticipate', () => {
    it('should allow user to leave a session', async () => {
      mockPrisma.sessionParticipation.findUnique.mockResolvedValue({ sessionId: 1, userId: 2 });
      mockPrisma.sessionParticipation.delete.mockResolvedValue({ sessionId: 1, userId: 2 });

      await expect(sessionService.unparticipate(1, 2)).resolves.toBeUndefined();
    });

    it('should throw NotFoundError when participation does not exist', async () => {
      mockPrisma.sessionParticipation.findUnique.mockResolvedValue(null);

      await expect(sessionService.unparticipate(1, 2)).rejects.toThrow(NotFoundError);
    });
  });
});
