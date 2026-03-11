import api from '../api';

export type AuthUser = { id: string; username: string; role?: string | null } | null;

const TOKEN_KEY = 'token';

export async function login(username: string, password: string) {
  const res = await api.post('/auth/login', { username, password });
  const data = res?.data ?? null;
  // support response shapes: { token, user } or { data: { token, user } }
  const token = data?.token ?? data?.data?.token ?? null;
  const user = data?.user ?? data?.data?.user ?? null;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  return { user, token, raw: res };
}

export async function register(username: string, password: string, email?: string) {
  const res = await api.post('/auth/register', { username, password, email });
  const data = res?.data ?? null;
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function decodeTokenRole(token?: string) {
  try {
    const t = token || getToken();
    if (!t) return null;
    const parts = t.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.role || null;
  } catch (e) {
    return null;
  }
}

export default { login, register, logout, getToken, decodeTokenRole };
