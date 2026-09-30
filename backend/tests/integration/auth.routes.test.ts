import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../../src/prisma';
import * as bcrypt from 'bcrypt';
import { startTestServer, stopTestServer } from '../helpers/test-server';

const mockPrisma = vi.mocked(prisma);

let baseUrl: string;

describe('Auth Routes', () => {
  beforeAll(async () => {
    baseUrl = await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
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

      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'new@test.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toHaveProperty('token');
      expect(body.email).toBe('new@test.com');
    });

    it('should return 400 for invalid registration data', async () => {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid', password: '123' }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
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

      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'wrong@test.com', password: 'password123' }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.message).toBe('Invalid credentials');
    });

    it('should return 400 for missing fields', async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com' }),
      });

      expect(response.status).toBe(400);
    });
  });
});
