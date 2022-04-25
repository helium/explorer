import { useEffect, useCallback} from 'react'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

const AuthFilter = ({ children }) => {
  if (true) {
    return (
      <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
        <Recaptcha />
      </GoogleReCaptchaProvider>
    )
  }
  return children
}

const Recaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    console.log('handle verify')
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }

    const token = await executeRecaptcha('auth')
    console.log('token', token)
    // Do whatever you want with the token
  }, [executeRecaptcha])

  // You can use useEffect to trigger the verification as soon as the component being loaded
  useEffect(() => {
    handleReCaptchaVerify()
  }, [handleReCaptchaVerify])
  return null
}

export default AuthFilter
