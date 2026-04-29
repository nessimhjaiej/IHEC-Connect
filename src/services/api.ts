const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ihec_token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Auth ---
export const authApi = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<{ id: string; name: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => request<{ id: string; name: string; email: string; role: string }>('/api/auth/me'),
};

// --- Sessions ---
export const sessionsApi = {
  list: () => request<unknown[]>('/api/sessions'),
  get: (id: string) => request<unknown>(`/api/sessions/${id}`),
  create: (data: unknown) =>
    request<unknown>('/api/sessions', { method: 'POST', body: JSON.stringify(data) }),
  join: (id: string) =>
    request<unknown>(`/api/sessions/${id}/join`, { method: 'POST' }),
};

// --- Users ---
export const usersApi = {
  list: () => request<unknown[]>('/api/users'),
  get: (id: string) => request<unknown>(`/api/users/${id}`),
  update: (id: string, data: unknown) =>
    request<unknown>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// --- Participants ---
export const participantsApi = {
  list: () => request<unknown[]>('/api/participants'),
  getBySession: (sessionId: string) =>
    request<unknown[]>(`/api/participants?session_id=${sessionId}`),
};

// --- Reviews ---
export const reviewsApi = {
  list: (sessionId?: string) =>
    request<unknown[]>(sessionId ? `/api/reviews?session_id=${sessionId}` : '/api/reviews'),
  create: (data: unknown) =>
    request<unknown>('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
};

// --- Subjects ---
export const subjectsApi = {
  list: () => request<unknown[]>('/api/subjects'),
  get: (id: string) => request<unknown>(`/api/subjects/${id}`),
};
