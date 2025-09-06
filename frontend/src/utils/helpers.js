// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Format rating to one decimal
export const formatRating = (rating) => {
  if (!rating) return '0.0'
  return parseFloat(rating).toFixed(1)
}

// Capitalize first letter
export const capitalizeFirst = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Generate unique ID
export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Sort data by key
export const sortData = (data, key, direction = 'asc') => {
  return [...data].sort((a, b) => {
    let aValue = a[key]
    let bValue = b[key]
    
    // Handle nested objects
    if (key.includes('.')) {
      const keys = key.split('.')
      aValue = keys.reduce((obj, k) => obj?.[k], a)
      bValue = keys.reduce((obj, k) => obj?.[k], b)
    }
    
    // Handle null/undefined values
    if (aValue == null) return 1
    if (bValue == null) return -1
    
    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    // Handle strings with localeCompare
    const aStr = aValue.toString().toLowerCase()
    const bStr = bValue.toString().toLowerCase()
    
    return direction === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr)
  })
}

// Filter data by multiple filters
export const filterData = (data, filters) => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true
      
      let itemValue = item[key]
      
      // Handle nested objects
      if (key.includes('.')) {
        const keys = key.split('.')
        itemValue = keys.reduce((obj, k) => obj?.[k], item)
      }
      
      if (itemValue == null) return false
      
      return itemValue.toString().toLowerCase().includes(value.toLowerCase())
    })
  })
}

// Download CSV from data
export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (value == null) return ''
        return typeof value === 'string'
          ? `"${value.replace(/"/g, '""').replace(/\n/g, '\\n')}"`
          : value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Handle API error
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || `Error: ${error.response.status}`
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection.'
  } else {
    // Other errors (e.g., setup issues, parsing errors)
    return error.message || 'An unexpected error occurred.'
  }
}
