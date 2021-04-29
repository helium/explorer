import { useCallback, useEffect } from 'react'

const useKeydown = (keyHandlers, ref) => {
  const handleKeydown = useCallback(
    (event) => {
      if (!ref) {
        // Disable global shortcuts when the user is typing
        if (document.activeElement.tagName === 'INPUT') return
        if (document.activeElement.tagName === 'TEXTAREA') return
      }

      if (keyHandlers[event.key]) {
        event.preventDefault()
        keyHandlers[event.key]()
      }
    },
    [keyHandlers, ref],
  )

  useEffect(() => {
    if (ref) {
      const currentRef = ref.current
      currentRef.addEventListener('keydown', handleKeydown)

      return () => {
        currentRef.removeEventListener('keydown', handleKeydown)
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown, ref])
}

export default useKeydown
