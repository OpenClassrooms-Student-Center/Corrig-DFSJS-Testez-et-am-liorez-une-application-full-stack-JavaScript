import { describe, it, expect, vi } from 'vitest';

vi.unmock('../../../src/prisma');

import { generateToken, verifyToken } from '../../../src/utils/jwt.util';

describe('JWT Utility', () => {
  it('should generate a valid token', () => {
    const token = generateToken(1);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify a valid token', () => {
    const token = generateToken(42);
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.userId).toBe(42);
  });

  it('should return null for an invalid token', () => {
    const decoded = verifyToken('invalid-token');
    expect(decoded).toBeNull();
  });

  it('should return null for an expired token', () => {
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign(
      { userId: 1 },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '0s' },
    );
    const decoded = verifyToken(expiredToken);
    expect(decoded).toBeNull();
  });
});
