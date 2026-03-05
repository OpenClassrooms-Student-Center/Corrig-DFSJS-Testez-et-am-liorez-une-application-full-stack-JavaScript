import { sessionRepository } from '../repositories/session.repository';
import { participationRepository } from '../repositories/participation.repository';
import { userRepository } from '../repositories/user.repository';
import { teacherRepository } from '../repositories/teacher.repository';
import { NotFoundError, ForbiddenError, ConflictError } from '../errors/app-error';
import { SessionResponse } from '../types';

type SessionWithDetails = NonNullable<Awaited<ReturnType<typeof sessionRepository.findById>>>;

function toSessionResponse(session: SessionWithDetails): SessionResponse {
  return {
    id: session.id,
    name: session.name,
    date: session.date,
    description: session.description,
    teacher: {
      id: session.teacher.id,
      firstName: session.teacher.firstName,
      lastName: session.teacher.lastName,
    },
    users: session.participants.map((p) => p.user.id),
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

async function requireAdmin(userId: number): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user || !user.admin) {
    throw new ForbiddenError('Admin access required');
  }
}

export const sessionService = {
  async getAll(): Promise<SessionResponse[]> {
    const sessions = await sessionRepository.findAll();
    return sessions.map(toSessionResponse);
  },

  async getById(id: number): Promise<SessionResponse> {
    const session = await sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundError('Session not found');
    }
    return toSessionResponse(session);
  },

  async create(userId: number, data: { name: string; date: string; description: string; teacherId: number }): Promise<SessionResponse> {
    await requireAdmin(userId);

    const teacher = await teacherRepository.findById(data.teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const session = await sessionRepository.create({
      name: data.name,
      date: new Date(data.date),
      description: data.description,
      teacherId: data.teacherId,
    });
    return toSessionResponse(session);
  },

  async update(userId: number, id: number, data: { name?: string; date?: string; description?: string; teacherId?: number }): Promise<SessionResponse> {
    await requireAdmin(userId);

    const existing = await sessionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Session not found');
    }

    if (data.teacherId) {
      const teacher = await teacherRepository.findById(data.teacherId);
      if (!teacher) {
        throw new NotFoundError('Teacher not found');
      }
    }

    const updateData: { name?: string; date?: Date; description?: string; teacherId?: number } = {};
    if (data.name) updateData.name = data.name;
    if (data.date) updateData.date = new Date(data.date);
    if (data.description) updateData.description = data.description;
    if (data.teacherId) updateData.teacherId = data.teacherId;

    const session = await sessionRepository.update(id, updateData);
    return toSessionResponse(session);
  },

  async delete(userId: number, id: number): Promise<void> {
    await requireAdmin(userId);

    const existing = await sessionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Session not found');
    }

    await sessionRepository.delete(id);
  },

  async participate(sessionId: number, userId: number): Promise<void> {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const existing = await participationRepository.findBySessionAndUser(sessionId, userId);
    if (existing) {
      throw new ConflictError('User already participating in this session');
    }

    await participationRepository.create(sessionId, userId);
  },

  async unparticipate(sessionId: number, userId: number): Promise<void> {
    const existing = await participationRepository.findBySessionAndUser(sessionId, userId);
    if (!existing) {
      throw new NotFoundError('Participation not found');
    }

    await participationRepository.delete(sessionId, userId);
  },
};
