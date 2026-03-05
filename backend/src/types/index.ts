import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  userId?: number;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  token: string;
}

export interface SessionResponse {
  id: number;
  name: string;
  date: Date;
  description: string;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
  };
  users: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeacherResponse {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageResponse {
  message: string;
}
