import { useAuthStore } from '@/store/auth';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://dogspa-backend-production.up.railway.app'
  : 'https://dogspa-backend-production.up.railway.app';

export const useApi = () => {
  const { token } = useAuthStore();

  const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
        throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  };

  return {
    get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint: string, data: any) => apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    put: (endpoint: string, data: any) => apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' }),
  };
};