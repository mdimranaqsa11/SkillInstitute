import { api } from './client';

export const createModule = (course_id, payload) =>
  api.post(`/courses/${course_id}/modules`, payload);
export const listModules = course_id => api.get(`/courses/${course_id}/modules`);
export const updateModule = (module_id, payload) => api.put(`/modules/${module_id}`, payload);
export const deleteModule = module_id => api.del(`/modules/${module_id}`);
