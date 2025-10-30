// API utility for Express backend
// This replaces Inertia router calls with fetch API calls

const API_BASE = '/api'; // Proxied to http://localhost:8000/api by Vite

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class API {
  private async request(endpoint: string, options: FetchOptions = {}) {
    const { params, ...fetchOptions } = options;
    
    // Build URL with query params
    let url = `${API_BASE}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // Always include credentials for cookies
    const response = await fetch(url, {
      ...fetchOptions,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers
      }
    });

    // Handle errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      // Throw the parsed error object so callers can inspect validation errors
      throw error;
    }

    return response.json();
  }

  // GET request
  async get(endpoint: string, params?: Record<string, string>) {
    return this.request(endpoint, { method: 'GET', params });
  }

  // POST request
  async post(endpoint: string, data?: unknown) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint: string, data?: unknown) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // PATCH request
  async patch(endpoint: string, data?: unknown) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint: string, data?: unknown) {
    return this.request(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // Auth methods
  auth = {
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) => 
      this.post('/auth/register', data),
    
    login: (data: { email: string; password: string; remember?: boolean }) => 
      this.post('/auth/login', data),
    
    logout: () => 
      this.post('/auth/logout'),
    
    getUser: () => 
      this.get('/auth/user'),
    
    forgotPassword: (email: string) => 
      this.post('/auth/forgot-password', { email }),
    
    resetPassword: (data: { email: string; password: string; token: string }) => 
      this.post('/auth/reset-password', data),
    
    confirmPassword: (password: string) => 
      this.post('/auth/confirm-password', { password })
  };

  // Spotify methods
  spotify = {
    search: (params: { q: string; type?: string; limit?: number; market?: string }) => {
      // Convert all params to strings for URLSearchParams
      const stringParams: Record<string, string> = {
        q: params.q,
        ...(params.type && { type: params.type }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.market && { market: params.market })
      };
      return this.get('/spotify/search', stringParams);
    },
    
    getArtist: (id: string) => 
      this.get(`/spotify/artists/${id}`),
    
    getArtistTopTracks: (id: string, market = 'PH') => 
      this.get(`/spotify/artists/${id}/top-tracks`, { market }),
    
    getAlbum: (id: string, market = 'PH') => 
      this.get(`/spotify/albums/${id}`, { market }),
    
    getAlbumTracks: (id: string, market = 'PH') => 
      this.get(`/spotify/albums/${id}/tracks`, { market }),
    
    getTrack: (id: string, market = 'PH') => 
      this.get(`/spotify/tracks/${id}`, { market })
  };

  // Track methods
  tracks = {
    getSB19Popular: () => 
      this.get('/tracks/sb19/popular'),
    
    getMemberTracks: (memberId: string) => 
      this.get(`/tracks/member/${memberId}`),
    
    getAll: () => 
      this.get('/tracks'),
    
    getById: (id: string) => 
      this.get(`/tracks/${id}`)
  };

  // Settings methods
  settings = {
    getProfile: () => 
      this.get('/settings/profile'),
    
    updateProfile: (data: { name?: string; email?: string }) => 
      this.patch('/settings/profile', data),
    
    deleteAccount: (data: { password: string }) => 
      this.delete('/settings/profile', data),
    
    updatePassword: (data: { current_password: string; password: string }) => 
      this.put('/settings/password', data)
  };
}

export const api = new API();
export default api;
