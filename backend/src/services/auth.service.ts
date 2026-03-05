import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';
import { userRepository } from '../repositories/user.repository';
import { UnauthorizedError, ConflictError } from '../errors/app-error';
import { AuthResponseDto } from '../types';

function toAuthResponse(user: { id: number; email: string; firstName: string; lastName: string; admin: boolean }, token: string): AuthResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    admin: user.admin,
    token,
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken(user.id);
    return toAuthResponse(user, token);
  },

  async register(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponseDto> {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = generateToken(user.id);
    return toAuthResponse(user, token);
  },
};
