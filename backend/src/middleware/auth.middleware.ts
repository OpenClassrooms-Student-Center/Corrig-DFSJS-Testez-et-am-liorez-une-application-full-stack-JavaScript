import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { AuthRequest } from '../types';
import { UnauthorizedError } from '../errors/app-error';

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Invalid token format');
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  req.userId = decoded.userId;
  next();
}
