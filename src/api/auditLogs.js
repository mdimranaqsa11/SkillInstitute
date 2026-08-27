import { api } from './client';

export const listAuditLogs = (page = 1, page_size = 20) =>
  api.get('/audit-logs', { page, page_size });
