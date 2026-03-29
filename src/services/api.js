const BASE_URL = 'http://localhost:8080/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders()
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=session_expired';
      throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },
  post: async (endpoint, data) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data)
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=session_expired';
      throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json') ? response.json() : response.text();
  },
  put: async (endpoint, data) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data)
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=session_expired';
      throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json') ? response.json() : response.text();
  },
  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=session_expired';
      throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
    }

    if (!response.ok) {
      // Try to parse error message from JSON response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi: ${response.statusText}`);
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }
};
