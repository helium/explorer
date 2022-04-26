import { useCallback, useState, useEffect } from 'react'

const TOKEN_KEY = 'BLOCKJOY_AUTH_TOKEN'

const useAuth = () => {
  const [ authToken, setAuthToken ] = useState()
  const [ initialized, setInitialized ] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    setAuthToken(savedToken)
    setInitialized(true)
  }, [])

  const updateAuthToken = useCallback((token) => {
    localStorage.setItem(TOKEN_KEY, token)
    setAuthToken(token)
  }, [])

  const clearAuthToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setAuthToken(null)
  }, [])

  return {
    authToken,
    updateAuthToken,
    clearAuthToken,
    initialized
  }
}

export default useAuth
