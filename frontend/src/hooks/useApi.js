import { useState, useEffect, useCallback } from 'react'

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, dependencies)

  const refetch = useCallback(() => {
    return execute()
  }, [execute])

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch, execute }
}

export const useApiMutation = (apiFunction) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}