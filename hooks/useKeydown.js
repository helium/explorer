import { useCallback, useEffect } from 'react'

const useKeydown = (keyHandlers) => {
  const handleKeydown = useCallback(
    (event) => {
      // Disable the following keyboard shortcuts when the user is typing
      if (document.activeElement.tagName === 'INPUT') return
      if (document.activeElement.tagName === 'TEXTAREA') return

      if (keyHandlers[event.key]) {
        event.preventDefault()
        keyHandlers[event.key]()
      }
    },
    [keyHandlers],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])
}

export default useKeydown
