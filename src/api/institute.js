import { api } from './client';

export const getMyInstitute = () => api.get('/institute/me');
export const getInstituteProfile = () => api.get('/institute/profile');
export const updateInstituteProfile = payload => api.put('/institute/profile', payload);
