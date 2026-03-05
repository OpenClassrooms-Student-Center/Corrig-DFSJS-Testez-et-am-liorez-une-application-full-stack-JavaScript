import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '../../../src/services/user.service';
import prisma from '../../../src/prisma';
import { NotFoundError, ForbiddenError } from '../../../src/errors/app-error';

const mockPrisma = vi.mocked(prisma);

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

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getById(1);
      expect(result.email).toBe('user@test.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.getById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete own account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      await expect(userService.delete(1, 1)).resolves.toBeUndefined();
    });

    it('should throw ForbiddenError when deleting another user', async () => {
      await expect(userService.delete(1, 2)).rejects.toThrow(ForbiddenError);
      await expect(userService.delete(1, 2)).rejects.toThrow('You can only delete your own account');
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.delete(1, 1)).rejects.toThrow(NotFoundError);
    });
  });

  describe('promoteSelfToAdmin', () => {
    it('should promote user to admin in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, admin: true });

      const result = await userService.promoteSelfToAdmin(1);
      expect(result.admin).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it('should throw ForbiddenError in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      await expect(userService.promoteSelfToAdmin(1)).rejects.toThrow(ForbiddenError);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
