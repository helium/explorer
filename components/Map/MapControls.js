import classNames from 'classnames'
import Image from 'next/image'
import useInfoBox from '../../hooks/useInfoBox'
import useMapLayer from '../../hooks/useMapLayer'
import MapLocationButton from './MapLocationButton'

const MapControls = () => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()
  const { showMapLayers, toggleMapLayers } = useMapLayer()

  return (
    <div
      className={classNames(
        'fixed right-0 bottom-0 p-4 md:p-8 grid-flow-row gap-3 transform-gpu transition-transform duration-300 ease-in-out',
        {
          grid: !showInfoBox,
          'hidden md:grid': showInfoBox,
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
      <MapLocationButton />
      <div
        className="cursor-pointer bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        onClick={toggleMapLayers}
      >
        <Image src="/images/layer.svg" width={20} height={20} />
      </div>
    </div>
  )
}

export default MapControls
