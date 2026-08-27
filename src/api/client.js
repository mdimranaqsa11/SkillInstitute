import { API_BASE_URL } from './config';
import { loadSession, saveTokens, clearSession } from './tokenStorage';

export class ApiError extends Error {
  constructor(status, message, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let sessionExpiredHandler = null;
export function setSessionExpiredHandler(fn) {
  sessionExpiredHandler = fn;
}

let refreshInFlight = null;

async function doRefresh() {
  const { refreshToken } = await loadSession();
  if (!refreshToken) throw new ApiError(401, 'No refresh token', 'NO_REFRESH_TOKEN');

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message || 'Session expired', json?.error?.code);
  }
  await saveTokens(json.data);
  return json.data.access_token;
}

async function refreshOnce() {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/**
 * @param {string} path e.g. '/branches' or '/branches/5'
 * @param {object} opts
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [opts.method]
 * @param {object} [opts.body]
 * @param {FormData} [opts.form] multipart body; when set, `body` is ignored and
 *   Content-Type is left for fetch to set (so it includes the multipart boundary)
 * @param {object} [opts.params] query params
 * @param {boolean} [opts.auth] send Authorization header (default true)
 */
export async function apiRequest(path, opts = {}) {
  const { method = 'GET', body, form, params, auth = true } = opts;

  let url = `${API_BASE_URL}${path}`;
  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const doFetch = async () => {
    const headers = form ? {} : { 'Content-Type': 'application/json' };
    if (auth) {
      const { accessToken } = await loadSession();
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }
    const res = await fetch(url, {
      method,
      headers,
      body: form || (body !== undefined ? JSON.stringify(body) : undefined),
    });
    return res;
  };

  let res = await doFetch();

  if (res.status === 401 && auth && path !== '/auth/refresh') {
    try {
      await refreshOnce();
      res = await doFetch();
    } catch (e) {
      await clearSession();
      if (sessionExpiredHandler) sessionExpiredHandler();
      throw new ApiError(401, 'Session expired, please log in again', 'SESSION_EXPIRED');
    }
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    if (res.status === 401 && sessionExpiredHandler) sessionExpiredHandler();
    throw new ApiError(
      res.status,
      json?.message || `Request failed (${res.status})`,
      json?.error?.code,
      json?.error?.details,
    );
  }

  return { data: json.data, pagination: json.pagination };
}

export const api = {
  get: (path, params) => apiRequest(path, { method: 'GET', params }),
  post: (path, body, opts) => apiRequest(path, { method: 'POST', body, ...opts }),
  put: (path, body) => apiRequest(path, { method: 'PUT', body }),
  del: (path, body) => apiRequest(path, { method: 'DELETE', body }),
  postForm: (path, form) => apiRequest(path, { method: 'POST', form }),
  putForm: (path, form) => apiRequest(path, { method: 'PUT', form }),
};
