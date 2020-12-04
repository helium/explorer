import { useState, useLayoutEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

const useResponsive = () => {
  const [isClient, setIsClient] = useState(false)

  const isMobile = useMediaQuery({
    maxWidth: 767,
  })

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true)
  }, [])

  return {
    isMobile: isClient ? isMobile : false,
    isClient,
  }
}

export default useResponsive
