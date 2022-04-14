import { useCallback } from 'react'
import useGeolocation from '../../hooks/useGeolocation'

const MapLocationButton = () => {
  const { isLoading, requestCurrentPosition } = useGeolocation()

  const handleLocationClick = useCallback(() => {
    if (isLoading) return
    requestCurrentPosition()
  }, [isLoading, requestCurrentPosition])

  return (
    <div
      className="cursor-pointer bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
      onClick={handleLocationClick}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <img alt="" src="/images/location.svg" className="w-5 h-5" />
      )}
    </div>
  )
}

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-navy-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

export default MapLocationButton
