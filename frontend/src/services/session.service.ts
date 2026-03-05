import api from './api';
import { Session, SessionFormData } from '../types';

export const sessionService = {
  getAll(signal?: AbortSignal): Promise<Session[]> {
    return api.get<Session[]>('/session', { signal }).then((res) => res.data);
  },

  getById(id: number, signal?: AbortSignal): Promise<Session> {
    return api.get<Session>(`/session/${id}`, { signal }).then((res) => res.data);
  },

  create(data: SessionFormData): Promise<Session> {
    return api.post<Session>('/session', data).then((res) => res.data);
  },

  update(id: number, data: Partial<SessionFormData>): Promise<Session> {
    return api.put<Session>(`/session/${id}`, data).then((res) => res.data);
  },

  delete(id: number): Promise<void> {
    return api.delete(`/session/${id}`).then(() => undefined);
  },

  participate(sessionId: number, userId: number): Promise<void> {
    return api.post(`/session/${sessionId}/participate/${userId}`).then(() => undefined);
  },

  unparticipate(sessionId: number, userId: number): Promise<void> {
    return api.delete(`/session/${sessionId}/participate/${userId}`).then(() => undefined);
  },
};
