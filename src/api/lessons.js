import { api } from './client';

export const createLesson = (module_id, payload) =>
  api.post(`/modules/${module_id}/lessons`, payload);
export const listLessons = module_id => api.get(`/modules/${module_id}/lessons`);
export const getLesson = lesson_id => api.get(`/lessons/${lesson_id}`);
export const updateLesson = (lesson_id, payload) => api.put(`/lessons/${lesson_id}`, payload);
export const deleteLesson = lesson_id => api.del(`/lessons/${lesson_id}`);
