import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../../src/services/auth.service';
import prisma from '../../../src/prisma';
import { UnauthorizedError, ConflictError } from '../../../src/errors/app-error';
import * as bcrypt from 'bcrypt';

const mockPrisma = vi.mocked(prisma);

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return auth response on successful login', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login('test@test.com', 'password123');
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@test.com');
      expect(result.token).toBeDefined();
    });

    it('should throw UnauthorizedError for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login('wrong@test.com', 'password123')).rejects.toThrow(UnauthorizedError);
      await expect(authService.login('wrong@test.com', 'password123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedError for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.login('test@test.com', 'wrong-password')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('register', () => {
    it('should create a new user and return auth response', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        email: 'new@test.com',
        firstName: 'Jane',
        lastName: 'Doe',
        admin: false,
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register('new@test.com', 'password123', 'Jane', 'Doe');
      expect(result.id).toBe(1);
      expect(result.email).toBe('new@test.com');
      expect(result.token).toBeDefined();
    });

    it('should throw ConflictError when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register('existing@test.com', 'password123', 'Jane', 'Doe')).rejects.toThrow(ConflictError);
      await expect(authService.register('existing@test.com', 'password123', 'Jane', 'Doe')).rejects.toThrow('Email already exists');
    });

    it('should hash the password before storing', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        email: 'new@test.com',
        firstName: 'Jane',
        lastName: 'Doe',
        admin: false,
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await authService.register('new@test.com', 'password123', 'Jane', 'Doe');

      const createCall = mockPrisma.user.create.mock.calls[0][0];
      expect(createCall.data.password).not.toBe('password123');
      expect(createCall.data.password.length).toBeGreaterThan(10);
    });
  });
});
