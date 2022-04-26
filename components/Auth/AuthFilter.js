import React, { memo, useCallback } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import useAuth from '../../hooks/useAuth'
import { fetchApi } from '../../hooks/useApi'
import Recaptcha from './Recaptcha'

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

const AuthFilter = ({ children }) => {
  const { authToken, updateAuthToken, initialized } = useAuth()

  const handleVerify = useCallback(async (token) => {
    const auth = await fetchApi('v1')(
      '/auth',
      { 'g-recaptcha-response': token }
    )
    updateAuthToken(auth.token)
  }, [updateAuthToken])

  if (!initialized) {
    return null
  }

  if (authToken) {
    return children
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
      <Recaptcha onVerify={handleVerify} />
    </GoogleReCaptchaProvider>
  )
}

export default memo(AuthFilter)
