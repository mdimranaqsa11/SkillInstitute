import { api } from './client';

export const listEnrollments = () => api.get('/enrollments');
export const getEnrollment = enrollment_id => api.get(`/enrollments/${enrollment_id}`);
