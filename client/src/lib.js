export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

export function getToken() {
  return sessionStorage.getItem('token') || null;
}

export function setAuthToken(token) {
  if (token) sessionStorage.setItem('token', token);
  else sessionStorage.removeItem('token');
  window.dispatchEvent(new Event('auth:change'));
}

/** Robust fetch-wrapper */
export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const raw = await res.text();
  let data;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === 'string' && data) ||
      `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}
