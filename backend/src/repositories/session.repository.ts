import prisma from '../prisma';

const sessionWithDetails = {
  teacher: true,
  participants: {
    include: {
      user: true,
    },
  },
} as const;

export const sessionRepository = {
  findAll() {
    return prisma.session.findMany({ include: sessionWithDetails });
  },

  findById(id: number) {
    return prisma.session.findUnique({
      where: { id },
      include: sessionWithDetails,
    });
  },

  create(data: { name: string; date: Date; description: string; teacherId: number }) {
    return prisma.session.create({
      data,
      include: sessionWithDetails,
    });
  },

  update(id: number, data: { name?: string; date?: Date; description?: string; teacherId?: number }) {
    return prisma.session.update({
      where: { id },
      data,
      include: sessionWithDetails,
    });
  },

  delete(id: number) {
    return prisma.session.delete({ where: { id } });
  },
};
