import prisma from '../prisma';

export const userRepository = {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: { email: string; password: string; firstName: string; lastName: string }) {
    return prisma.user.create({
      data: { ...data, admin: false },
    });
  },

  update(id: number, data: { admin?: boolean }) {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};
