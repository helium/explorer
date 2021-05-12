import classNames from 'classnames'
import { useCallback } from 'react'
import useMapLayer from '../../hooks/useMapLayer'

const Layer = ({ title, onClick, active = false }) => (
  <div
    className="flex items-center justify-end space-x-2 cursor-pointer"
    onClick={onClick}
  >
    <span
      className={classNames('text-sm', {
        'text-navy-400 font-semibold': active,
        'text-white': !active,
      })}
    >
      {title}
    </span>
    <div className="bg-gray-700 w-10 h-10 rounded-full mb-1" />
  </div>
)

const MapLayersBox = () => {
  const {
    showMapLayers,
    setMapLayer,
    mapLayer,
    toggleMapLayers,
  } = useMapLayer()

  const handleClick = useCallback(
    (clickedLayer) => () => {
      if (mapLayer === clickedLayer) {
        setMapLayer(null)
        return
      }

      setMapLayer(clickedLayer)
    },
    [mapLayer, setMapLayer],
  )

  return (
    <div
      className={classNames(
        'fixed bottom-0 right-6 p-4 z-10 transform-gpu transition-transform duration-300 ease-in-out',
        {
          'translate-y-120': !showMapLayers,
        },
      )}
    >
      {/* <div className="absolute flex justify-end w-full -top-14 left-0 px-4 md:px-0">
        <div
          className="md:hidden transform rotate-180"
          onClick={toggleMapLayers}
        >
          <Image src="/images/circle-arrow.svg" width={35} height={35} />
        </div>
      </div> */}
      <div className="flex flex-col space-y-2">
        <div
          onClick={toggleMapLayers}
          className="cursor-pointer w-10 h-10 flex items-center justify-center self-end"
        >
          <img src="/images/close.svg" />
        </div>
        <Layer
          title="New Hotspots"
          onClick={handleClick('added')}
          active={mapLayer === 'added'}
        />
        <Layer
          title="Reward Scales"
          onClick={handleClick('rewardScale')}
          active={mapLayer === 'rewardScale'}
        />
        <Layer
          title="Owner"
          onClick={handleClick('owner')}
          active={mapLayer === 'owner'}
        />
        <Layer
          title="Offline"
          onClick={handleClick('offline')}
          active={mapLayer === 'offline'}
        />
      </div>
    </div>
  )
}

export default MapLayersBox
