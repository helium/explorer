import { memo, useCallback, useEffect } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const Recaptcha = ({ onVerify }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }

    const token = await executeRecaptcha('auth')
    onVerify(token)
  }, [executeRecaptcha, onVerify])

  useEffect(() => {
    handleReCaptchaVerify()
  }, [handleReCaptchaVerify])

  return null
}

export default memo(Recaptcha)
