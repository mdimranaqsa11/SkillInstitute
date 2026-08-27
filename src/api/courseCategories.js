import { api } from './client';

export const createCourseCategory = payload => api.post('/course-categories', payload);
export const listCourseCategories = () => api.get('/course-categories');
export const getCourseCategory = category_id => api.get(`/course-categories/${category_id}`);
export const updateCourseCategory = (category_id, payload) =>
  api.put(`/course-categories/${category_id}`, payload);
export const deleteCourseCategory = category_id => api.del(`/course-categories/${category_id}`);
