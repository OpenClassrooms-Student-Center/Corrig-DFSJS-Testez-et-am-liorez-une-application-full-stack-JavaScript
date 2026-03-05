import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((issue) => issue.message).join(', ');
    res.status(400).json({ message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ message: 'Resource already exists' });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
  }

  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal server error' });
}
