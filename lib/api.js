import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5050",
  timeout: 10000,
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

function onAccessTokenFetched(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const refreshUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5050"}/auth/refresh`;
        const { data } = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true }
        );
        const newAccessToken = data.data.token;
        setAccessToken(newAccessToken);
        isRefreshing = false;
        onAccessTokenFetched(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const fetcher = (url) => api.get(url).then(res => res.data).catch(err => { throw err; });

// Resource API Functions
export const resourceAPI = {
  // List resources with filters and pagination
  listResources: (params = {}) => {
    return api.get('/resources/list', { params });
  },

  // List public resources (no auth required)
  listPublicResources: (params = {}) => {
    return api.get('/resources/public', { params });
  },

  // Get organization resources
  getOrganizationResources: (organizationId, params = {}) => {
    return api.get(`/resources/organization/${organizationId}`, { params });
  },

  // Get event resources
  getEventResources: (eventId, params = {}) => {
    return api.get(`/resources/event/${eventId}`, { params });
  },

  // Get single resource by ID
  getResourceById: (resourceId) => {
    return api.get(`/resources/${resourceId}`);
  },

  // Create new resource (multipart/form-data)
  createResource: (formData) => {
    return api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update resource metadata
  updateResource: (resourceId, data) => {
    return api.patch(`/resources/${resourceId}`, data);
  },

  // Replace resource file
  replaceResourceFile: (resourceId, formData) => {
    return api.put(`/resources/${resourceId}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete resource (soft or hard delete)
  deleteResource: (resourceId, permanent = false) => {
    return api.delete(`/resources/${resourceId}`, {
      params: { permanent },
    });
  },

  // Batch delete resources
  batchDeleteResources: (resourceIds, permanent = false) => {
    return api.post('/resources/batch-delete', {
      resourceIds,
      permanent,
    });
  },

  // Restore soft-deleted resource
  restoreResource: (resourceId) => {
    return api.patch(`/resources/${resourceId}/restore`);
  },

  // Download resource
  downloadResource: (resourceId) => {
    return api.get(`/resources/${resourceId}/download`);
  },
};

export default api;
