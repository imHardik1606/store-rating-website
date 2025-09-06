export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STORE_OWNER: 'store_owner'
}

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  CHANGE_PASSWORD: '/auth/change-password',
  
  ADMIN_DASHBOARD: '/admin/dashboard-stats',
  ADMIN_USERS: '/admin/users',
  ADMIN_STORES: '/admin/stores',
  
  USER_STORES: '/user/stores',
  USER_RATINGS: '/user/ratings',
  
  STORE_DASHBOARD: '/store/dashboard',
  STORE_RATINGS: '/store/ratings'
}

export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
}

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
}

export const FORM_TYPES = {
  LOGIN: 'login',
  REGISTER: 'register',
  ADD_USER: 'addUser',
  ADD_STORE: 'addStore',
  CHANGE_PASSWORD: 'changePassword',
  RATING: 'rating'
}

export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully!',
  RATING_SUBMIT_SUCCESS: 'Rating submitted successfully!',
  RATING_UPDATE_SUCCESS: 'Rating updated successfully!',
  USER_CREATE_SUCCESS: 'User created successfully!',
  STORE_CREATE_SUCCESS: 'Store created successfully!',
  
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED_ERROR: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.'
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
}