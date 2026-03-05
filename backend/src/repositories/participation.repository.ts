import prisma from '../prisma';

export const participationRepository = {
  findBySessionAndUser(sessionId: number, userId: number) {
    return prisma.sessionParticipation.findUnique({
      where: { sessionId_userId: { sessionId, userId } },
    });
  },

  create(sessionId: number, userId: number) {
    return prisma.sessionParticipation.create({
      data: { sessionId, userId },
    });
  },

  delete(sessionId: number, userId: number) {
    return prisma.sessionParticipation.delete({
      where: { sessionId_userId: { sessionId, userId } },
    });
  },
};
