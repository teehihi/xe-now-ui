const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api';

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

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let result;

  try {
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }
  } catch (e) {
    result = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=session_expired';
      throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
    }
    if (response.status === 403) {
      // Dispatch global event for 403 forbidden — ForbiddenToast handles the notification
      window.dispatchEvent(new CustomEvent('api-forbidden', {
        detail: { message: result?.message || 'Bạn không có quyền thao tác này' }
      }));
      // Mark error so page-level catch blocks can suppress their own error display
      const err = new Error(result?.message || 'Bạn không có quyền thao tác này');
      err.isForbidden = true;
      throw err;
    }

    // Handle database reference/constraint errors (usually 400 or 409)
    const msg = (result?.message || '');
    if (response.status === 400 || response.status === 409 || response.status === 500) {
      if (msg.toLowerCase().includes('foreign key') || msg.toLowerCase().includes('reference') || msg.toLowerCase().includes('ràng buộc')) {
        const constraintMsg = msg.toLowerCase().includes('foreign key') ? 'Dữ liệu này đang được sử dụng ở nơi khác nên không thể xoá.' : msg;
        const constraintErr = new Error(constraintMsg);
        constraintErr.isConstraintViolation = true;
        throw constraintErr;
      }
    }

    throw new Error(result?.message || `Lỗi: ${response.statusText}`);
  }

  // Automatically unwrap ApiResponse structure
  if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
    return result.data;
  }
  return result;
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
    if (currentPath !== '/login' && !currentPath.includes('/login') && currentPath !== '/401') {
      window.location.href = `/401?redirect=${encodeURIComponent(currentPath)}`;
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

    return handleResponse(response);
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
