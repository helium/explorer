import classNames from 'classnames'
import { useCallback } from 'react'
import useMapLayer from '../../hooks/useMapLayer'

const Layer = ({ title, onClick, active = false, style }) => (
  <div
    className="flex items-center justify-end space-x-2 cursor-pointer absolute bottom-0 right-0 w-96 transform-gpu transition-transform duration-300 ease-in-out"
    onClick={onClick}
    style={style}
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

  const layers = [
    {
      title: 'New Hotspots',
      id: 'added',
    },
    {
      title: 'Reward Scales',
      id: 'rewardScale',
    },
    {
      title: 'Owner',
      id: 'owner',
    },
    {
      title: 'Offline',
      id: 'offline',
    },
  ]

  return (
    <div
      className={classNames(
        'fixed bottom-0 right-6 p-4 transform-gpu transition-all duration-300 ease-in-out',
        {
          'opacity-0': !showMapLayers,
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
      <div className="relative">
        <div
          onClick={toggleMapLayers}
          className="cursor-pointer w-10 h-10 flex items-center justify-center self-end transform-gpu transition-transform duration-300 ease-in-out"
          style={{
            transform: showMapLayers
              ? `translateY(-${50 * layers.length}px)`
              : 'translateY(0)',
          }}
        >
          <img src="/images/close.svg" />
        </div>
        {layers.map(({ title, id }, i) => (
          <Layer
            key={id}
            title={title}
            onClick={handleClick(id)}
            active={mapLayer === id}
            style={{
              transform: showMapLayers
                ? `translateY(-${50 * i}px)`
                : 'translateY(0)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default MapLayersBox
