import api from './api';
import { User } from '../types';

export const userService = {
  getById(id: number, signal?: AbortSignal): Promise<User> {
    return api.get<User>(`/user/${id}`, { signal }).then((res) => res.data);
  },

  delete(id: number): Promise<void> {
    return api.delete(`/user/${id}`).then(() => undefined);
  },

  promoteSelfToAdmin(): Promise<User> {
    return api.post<User>('/user/promote-admin', {}).then((res) => res.data);
  },
};
