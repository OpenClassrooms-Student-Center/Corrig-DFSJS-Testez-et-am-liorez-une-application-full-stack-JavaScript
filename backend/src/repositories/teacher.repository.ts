import prisma from '../prisma';

export const teacherRepository = {
  findAll() {
    return prisma.teacher.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id: number) {
    return prisma.teacher.findUnique({ where: { id } });
  },
};
