import { describe, it, expect, vi, beforeEach } from 'vitest';
import { teacherService } from '../../../src/services/teacher.service';
import prisma from '../../../src/prisma';
import { NotFoundError } from '../../../src/errors/app-error';

const mockPrisma = vi.mocked(prisma);

const mockTeacher = {
  id: 1,
  firstName: 'Margot',
  lastName: 'Delahaye',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Teacher Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all teachers', async () => {
      mockPrisma.teacher.findMany.mockResolvedValue([mockTeacher]);

      const result = await teacherService.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('Margot');
    });

    it('should return empty array when no teachers exist', async () => {
      mockPrisma.teacher.findMany.mockResolvedValue([]);

      const result = await teacherService.getAll();
      expect(result).toHaveLength(0);
    });
  });

  describe('getById', () => {
    it('should return a teacher by id', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(mockTeacher);

      const result = await teacherService.getById(1);
      expect(result.firstName).toBe('Margot');
      expect(result.lastName).toBe('Delahaye');
    });

    it('should throw NotFoundError when teacher does not exist', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(null);

      await expect(teacherService.getById(999)).rejects.toThrow(NotFoundError);
      await expect(teacherService.getById(999)).rejects.toThrow('Teacher not found');
    });
  });
});
