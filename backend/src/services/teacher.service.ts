import { teacherRepository } from '../repositories/teacher.repository';
import { NotFoundError } from '../errors/app-error';
import { TeacherResponse } from '../types';

export const teacherService = {
  async getAll(): Promise<TeacherResponse[]> {
    return teacherRepository.findAll();
  },

  async getById(id: number): Promise<TeacherResponse> {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }
    return teacher;
  },
};
