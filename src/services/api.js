const BASE_URL = 'http://localhost:8080/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Queue to hold pending requests while refreshing token
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const handleRefreshToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send Refresh Token Cookie
    });

    if (!response.ok) throw new Error('Session expired');
    
    const result = await response.json();
    const data = result.data || result;
    const newToken = data.token;
    
    if (newToken) {
      localStorage.setItem('token', newToken);
      return newToken;
    }
    throw new Error('Refresh failed');
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Save current path to redirect back after login if needed
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      window.location.href = `/login?error=session_expired&redirect=${encodeURIComponent(currentPath)}`;
    }
    return null;
  }
};

export const api = {
  request: async (endpoint, options = {}) => {
    const { isFormData, ...fetchOptions } = options;
    
    const requestOptions = {
      ...fetchOptions,
      headers: {
        ...getHeaders(isFormData),
        ...fetchOptions.headers,
      },
      credentials: 'include',
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);

    // Handle 401 - Unauthorized (Token expired)
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await handleRefreshToken();
        isRefreshing = false;
        
        if (newToken) {
          onRefreshed(newToken);
        }
      }

      // Return a promise that resolves when the token is refreshed
      const retryRequest = new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          requestOptions.headers['Authorization'] = `Bearer ${token}`;
          resolve(fetch(`${BASE_URL}${endpoint}`, requestOptions));
        });
      });

      response = await retryRequest;
    }

    if (response.status === 204) return null;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json') ? response.json() : response.text();
  },

  get: (endpoint) => api.request(endpoint, { method: 'GET' }),
  
  post: (endpoint, data) => {
    const isFormData = data instanceof FormData;
    return api.request(endpoint, {
      method: 'POST',
      isFormData,
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  put: (endpoint, data) => {
    const isFormData = data instanceof FormData;
    return api.request(endpoint, {
      method: 'PUT',
      isFormData,
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),
};
