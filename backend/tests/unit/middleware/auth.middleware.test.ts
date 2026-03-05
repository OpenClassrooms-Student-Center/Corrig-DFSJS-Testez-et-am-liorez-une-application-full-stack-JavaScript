import { describe, it, expect, vi } from 'vitest';
import { authMiddleware } from '../../../src/middleware/auth.middleware';
import { generateToken } from '../../../src/utils/jwt.util';
import { UnauthorizedError } from '../../../src/errors/app-error';
import { AuthRequest } from '../../../src/types';
import { Response, NextFunction } from 'express';

vi.unmock('../../../src/prisma');

function createMockReq(authHeader?: string): AuthRequest {
  return {
    headers: {
      authorization: authHeader,
    },
  } as AuthRequest;
}

function createMockRes(): Response {
  return {} as Response;
}

describe('Auth Middleware', () => {
  const next: NextFunction = vi.fn();

  it('should throw UnauthorizedError when no authorization header', () => {
    const req = createMockReq(undefined);
    expect(() => authMiddleware(req, createMockRes(), next)).toThrow(UnauthorizedError);
    expect(() => authMiddleware(req, createMockRes(), next)).toThrow('No token provided');
  });

  it('should throw UnauthorizedError when token format is invalid', () => {
    const req = createMockReq('InvalidFormat');
    expect(() => authMiddleware(req, createMockRes(), next)).toThrow(UnauthorizedError);
    expect(() => authMiddleware(req, createMockRes(), next)).toThrow('Invalid token format');
  });

  it('should throw UnauthorizedError when token is invalid', () => {
    const req = createMockReq('Bearer invalid-token');
    expect(() => authMiddleware(req, createMockRes(), next)).toThrow(UnauthorizedError);
    expect(() => authMiddleware(req, createMockRes(), next)).toThrow('Invalid or expired token');
  });

  it('should set userId and call next for a valid token', () => {
    const token = generateToken(42);
    const req = createMockReq(`Bearer ${token}`);
    const nextFn = vi.fn();

    authMiddleware(req, createMockRes(), nextFn);

    expect(req.userId).toBe(42);
    expect(nextFn).toHaveBeenCalled();
  });
});
