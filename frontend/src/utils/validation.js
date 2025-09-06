export const validateForm = (data, type) => {
  const errors = {}
  
  // Name validation for registration and user creation
  if (['register', 'addUser', 'addStore'].includes(type)) {
    if (!data.name || data.name.trim().length < 3 || data.name.trim().length > 60) {
      errors.name = 'Name must be between 3-60 characters'
    }
  }
  
  // Email validation
  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email || !emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
  }
  
  // Address validation
  if (['register', 'addUser', 'addStore'].includes(type)) {
    if (!data.address || data.address.trim().length === 0) {
      errors.address = 'Address is required'
    } else if (data.address.trim().length > 400) {
      errors.address = 'Address must be less than 400 characters'
    }
  }
  
  // Password validation
  if (['register', 'addUser', 'changePassword', 'login'].includes(type)) {
    if (!data.password) {
      errors.password = 'Password is required'
    } else if (['register', 'addUser', 'changePassword'].includes(type)) {
      if (data.password.length < 8 || data.password.length > 16) {
        errors.password = 'Password must be between 8-16 characters'
      } else if (!/[A-Z]/.test(data.password)) {
        errors.password = 'Password must contain at least one uppercase letter'
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
        errors.password = 'Password must contain at least one special character'
      }
    }
  }
  
  // Confirm password validation
  if (['register', 'changePassword'].includes(type) && data.confirmPassword !== undefined) {
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
  }
  
  // Rating validation
  if (type === 'rating') {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5'
    }
  }
  
  // Role validation for admin
  if (type === 'addUser' && data.role) {
    const validRoles = ['user', 'admin', 'store_owner']
    if (!validRoles.includes(data.role)) {
      errors.role = 'Invalid role selected'
    }
  }
  
  return errors
}

export const validateRating = (rating) => {
  return rating >= 1 && rating <= 5
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    password.length <= 16 &&
    /[A-Z]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  )
}