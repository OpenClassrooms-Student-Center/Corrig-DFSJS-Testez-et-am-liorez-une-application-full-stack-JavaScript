import api from './api';
import { Teacher } from '../types';

export const teacherService = {
  getAll(signal?: AbortSignal): Promise<Teacher[]> {
    return api.get<Teacher[]>('/teacher', { signal }).then((res) => res.data);
  },

  getById(id: number, signal?: AbortSignal): Promise<Teacher> {
    return api.get<Teacher>(`/teacher/${id}`, { signal }).then((res) => res.data);
  },
};
