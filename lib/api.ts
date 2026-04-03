const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://choir-backend.movie-night-api.workers.dev';

// ── Token helpers ──────────────────────────────────────────
export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// ── Base fetch ─────────────────────────────────────────────
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || 'Something went wrong');
  }
  return data;
}

// ── Auth ───────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch('/auth/me'),

  logout: () => {
    removeToken();
    apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
  },
};

// ── Members ────────────────────────────────────────────────
export const membersApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/members${query}`);
  },
  getOne: (id: string) => apiFetch(`/members/${id}`),
  create: (data: any) => apiFetch('/members', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/members/${id}`, { method: 'DELETE' }),
};

// ── Attendance ─────────────────────────────────────────────
export const attendanceApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/attendance${query}`);
  },
  getOne: (id: string) => apiFetch(`/attendance/${id}`),
  create: (data: any) => apiFetch('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/attendance/${id}`, { method: 'DELETE' }),
};

// ── Songs ──────────────────────────────────────────────────
export const songsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/songs${query}`);
  },
  getOne: (id: string) => apiFetch(`/songs/${id}`),
  create: (data: any) => apiFetch('/songs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/songs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/songs/${id}`, { method: 'DELETE' }),
};

// ── Minutes ────────────────────────────────────────────────
export const minutesApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/minutes${query}`);
  },
  getOne: (id: string) => apiFetch(`/minutes/${id}`),
  create: (data: any) => apiFetch('/minutes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/minutes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/minutes/${id}`, { method: 'DELETE' }),
};

// ── Users ──────────────────────────────────────────────────
export const usersApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/users${query}`);
  },
  getOne: (id: string) => apiFetch(`/users/${id}`),
  create: (data: any) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};

// ── Dashboard ──────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => apiFetch('/dashboard'),
};

export const eventsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/events${query}`);
  },
  getOne: (id: string) => apiFetch(`/events/${id}`),
  create: (data: any) => apiFetch('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/events/${id}`, { method: 'DELETE' }),
};