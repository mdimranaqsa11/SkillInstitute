import { api } from './client';

// Public self-signup — creates a MAIN institute + its first INSTITUTE_ADMIN user.
export const signupInstitute = payload => api.post('/institutes', payload, { auth: false });

export const getInstitute = institute_id => api.get(`/institutes/${institute_id}`);

// Permanently deletes the caller's own institute and every branch under it —
// irreversible, requires the acting admin's current password to confirm.
export const deleteInstitute = password => api.del('/institutes/me', { password });
