import { api } from './client';

// A "branch" is created with the same shape as institute signup (see institutes.js)
// but scoped under the caller's institute via the access token.
export const createBranch = payload => api.post('/branches', payload);
export const listBranches = (page = 1, page_size = 20) =>
  api.get('/branches', { page, page_size });
export const getBranch = branch_id => api.get(`/branches/${branch_id}`);
export const updateBranch = (branch_id, payload) => api.put(`/branches/${branch_id}`, payload);
export const deleteBranch = branch_id => api.del(`/branches/${branch_id}`);
