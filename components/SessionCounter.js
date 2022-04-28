import { memo, useEffect, useState } from 'react'
import { trackEvent } from '../hooks/useGA'

const LAST_AUTH_SESSION_KEY = "LAST_AUTH_SESSION_KEY"
const DAY_IN_MILLIS = 86400000
const FIVE_MIN_MILLIS = 300000

const SessionCounter = ({ children }) => {
  const [time, setTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, FIVE_MIN_MILLIS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const storedSession = localStorage.getItem(LAST_AUTH_SESSION_KEY)

    if (storedSession) {
      const lastSessionDate = new Date(Number.parseInt(storedSession))
      const sessionValid = time - lastSessionDate.getTime() < DAY_IN_MILLIS
      if (sessionValid) {
        return
      }
    }

    trackEvent('auth_session')
    localStorage.setItem(LAST_AUTH_SESSION_KEY, time.toString())
  }, [time])

  return children
}


export default memo(SessionCounter)
