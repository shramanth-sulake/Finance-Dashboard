const API_URL = 'http://localhost:3000/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

interface FetchOptions extends RequestInit {
  data?: any;
}

/**
 * Core API fetching utility that wraps standard fetch.
 * Automatically injects authorization headers and handles JSON lifecycle.
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        removeAuthToken();
      }
      throw new Error(data?.error || 'Something went wrong processing your request');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}
