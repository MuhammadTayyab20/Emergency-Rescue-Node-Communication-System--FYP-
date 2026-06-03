import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminStatsResponse,
  AdminUsersResponse,
  UserEntryRequest,
  UserEntryResponse,
} from '../types/api';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorPayload = await response.json();
      if (Array.isArray(errorPayload?.detail)) {
        message = errorPayload.detail.map((item: any) => item?.msg || JSON.stringify(item)).join('; ');
      } else if (typeof errorPayload?.detail === 'string') {
        message = errorPayload.detail;
      }
    } catch {
      // Keep generic message when JSON parsing fails.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function postUserEntry(payload: UserEntryRequest): Promise<UserEntryResponse> {
  return request<UserEntryResponse>('/api/users/entry', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function postAdminLogin(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAdminUsers(token: string): Promise<AdminUsersResponse> {
  return request<AdminUsersResponse>('/api/admin/users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAdminStats(token: string): Promise<AdminStatsResponse> {
  return request<AdminStatsResponse>('/api/admin/stats', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
