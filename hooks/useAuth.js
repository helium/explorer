import { useCallback, useState, useEffect } from 'react'
import { updateClient } from '../data/client'

const AUTH_TOKEN_STORAGE_KEY = 'BLOCKJOY_AUTH_TOKEN'

const useAuth = () => {
  const [ authToken, setAuthToken ] = useState()
  const [ initialized, setInitialized ] = useState(false)

  const clearAuthToken = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    setAuthToken(null)
    updateClient({ headers: { Authorization: undefined } })
  }, [])

  const authErrorHandler = useCallback((error) => {
    if (error && error.response && error.response.status === 401) {
      clearAuthToken()
    }
  }, [clearAuthToken])

  const updateAuthToken = useCallback((token) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    setAuthToken(token)
    updateClient({
      headers: {
        Authorization: `Basic ${token}`,
      },
      errorCallback: authErrorHandler,
    })
  }, [authErrorHandler])

  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    setAuthToken(savedToken)
    updateClient({
      headers: {
        Authorization: `Basic ${savedToken}`,
      },
      errorCallback: authErrorHandler,
    })
    setInitialized(true)
  }, [authErrorHandler])

  return {
    authToken,
    updateAuthToken,
    clearAuthToken,
    initialized
  }
}

export default useAuth
