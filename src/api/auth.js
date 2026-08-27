import { apiRequest } from './client';

export const login = (email, password) =>
  apiRequest('/auth/login', { method: 'POST', body: { email, password }, auth: false });

export const refresh = refreshToken =>
  apiRequest('/auth/refresh', { method: 'POST', body: { refresh_token: refreshToken }, auth: false });

export const logout = refreshToken =>
  apiRequest('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken }, auth: false });

export const me = () => apiRequest('/auth/me');
