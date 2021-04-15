import classNames from 'classnames'
import Image from 'next/image'
import { useCallback } from 'react'
import useGeolocation from '../../hooks/useGeolocation'
import useInfoBox from '../../hooks/useInfoBox'
import useMapLayer from '../../hooks/useMapLayer'

const MapControls = () => {
  const { toggleInfoBox } = useInfoBox()
  const { showMapLayers, toggleMapLayers } = useMapLayer()
  const {
    isLoading: isLoadingCurrentPosition,
    requestCurrentPosition,
  } = useGeolocation()

  const handleLocationClick = useCallback(() => {
    if (isLoadingCurrentPosition) return
    requestCurrentPosition()
  }, [isLoadingCurrentPosition, requestCurrentPosition])

  return (
    <div
      className={classNames(
        'fixed right-0 bottom-0 p-4 md:p-8 grid grid-flow-row gap-3 transform-gpu transition-transform duration-300 ease-in-out',
        {
          'translate-x-20': showMapLayers,
        },
      )}
    >
      <div
        className="cursor-pointer md:hidden bg-navy-400 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        onClick={toggleInfoBox}
      >
        <Image
          src="/images/arrow.svg"
          className="transform rotate-180"
          width={18}
          height={18}
        />
      </div>
      <div
        className="cursor-pointer bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        onClick={toggleMapLayers}
      >
        <Image src="/images/layer.svg" width={20} height={20} />
      </div>
      <div
        className="cursor-pointer bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        onClick={handleLocationClick}
      >
        {isLoadingCurrentPosition ? (
          <Spinner />
        ) : (
          <Image src="/images/location.svg" width={20} height={20} />
        )}
      </div>
    </div>
  )
}

const Spinner = () => (
  <svg
    class="animate-spin h-5 w-5 text-navy-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

export default MapControls
