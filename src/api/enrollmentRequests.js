import { api } from './client';

export const listEnrollmentRequests = () => api.get('/enrollment-requests');
export const getEnrollmentRequest = request_id => api.get(`/enrollment-requests/${request_id}`);
export const approveEnrollmentRequest = request_id =>
  api.post(`/enrollment-requests/${request_id}/approve`);
export const rejectEnrollmentRequest = (request_id, rejection_reason) =>
  api.post(`/enrollment-requests/${request_id}/reject`, { rejection_reason });
