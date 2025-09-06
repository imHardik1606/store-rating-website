import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  },
  
  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats')
    return response.data
  },
  
  getUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters })
    return response.data
  },
  
  getStores: async (filters = {}) => {
    const response = await api.get('/admin/stores', { params: filters })
    return response.data
  },
  
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData)
    return response.data
  },
  
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },
  
  createStore: async (storeData) => {
    const response = await api.post('/admin/stores', storeData)
    return response.data
  }
}

// User API
export const userAPI = {
  getStores: async (search = '', filters = {}) => {
    const response = await api.get('/user/stores', { 
      params: { search, ...filters } 
    })
    return response.data
  },
  
  submitRating: async (storeId, rating) => {
    const response = await api.post('/user/ratings', { storeId, rating })
    return response.data
  },
  
  updateRating: async (ratingId, rating) => {
    const response = await api.put(`/user/ratings/${ratingId}`, { rating })
    return response.data
  },
  
  getUserRatings: async () => {
    const response = await api.get('/user/ratings')
    return response.data
  }
}

// Store Owner API
export const storeAPI = {
  getDashboard: async () => {
    const response = await api.get('/store/dashboard')
    return response.data
  },
  
  getRatings: async () => {
    const response = await api.get('/store/ratings')
    return response.data
  },
  
  getStoreStats: async () => {
    const response = await api.get('/store/stats')
    return response.data
  }
}

export default api