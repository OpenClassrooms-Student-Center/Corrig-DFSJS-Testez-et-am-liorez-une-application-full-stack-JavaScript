import { userRepository } from '../repositories/user.repository';
import { NotFoundError, ForbiddenError } from '../errors/app-error';
import { UserResponse } from '../types';

function toUserResponse(user: { id: number; email: string; firstName: string; lastName: string; admin: boolean; createdAt: Date; updatedAt: Date }): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    admin: user.admin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const userService = {
  async getById(id: number): Promise<UserResponse> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return toUserResponse(user);
  },

  async delete(requesterId: number, targetId: number): Promise<void> {
    if (requesterId !== targetId) {
      throw new ForbiddenError('You can only delete your own account');
    }

    const user = await userRepository.findById(targetId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await userRepository.delete(targetId);
  },

  async promoteSelfToAdmin(userId: number): Promise<UserResponse> {
    const isDev = (process.env.NODE_ENV || 'development') === 'development';
    if (!isDev) {
      throw new ForbiddenError('Admin self-promotion is only available in development');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.admin) {
      return toUserResponse(user);
    }

    const updatedUser = await userRepository.update(userId, { admin: true });
    return toUserResponse(updatedUser);
  },
};
