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

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login?error=session_expired';
    throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
  }

  const contentType = response.headers.get('content-type');
  let result;
  if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!response.ok) {
    throw new Error(result.message || `Lỗi: ${response.statusText}`);
  }

  // Automatically unwrap ApiResponse and Page objects
  if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
    const actualData = result.data;
    if (actualData && typeof actualData === 'object' && 'content' in actualData && Array.isArray(actualData.content)) {
      return actualData.content;
    }
    return actualData;
  }
  return result;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  post: async (endpoint, data) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data)
    });
    return handleResponse(response);
  },
  put: async (endpoint, data) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};
