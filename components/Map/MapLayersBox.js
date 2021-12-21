import classNames from 'classnames'
import { useCallback } from 'react'
import useMapLayer from '../../hooks/useMapLayer'
import Hex from '../Icons/Hex'

const MapLayersBox = () => {
  const { showMapLayers, setMapLayer, mapLayer, toggleMapLayers } =
    useMapLayer()

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
    // {
    //   title: 'New Hotspots',
    //   id: 'added',
    // },
    {
      title: 'Default',
      id: 'default',
      icon: <Hex className="text-green-500 w-5 h-5" />,
    },
    {
      title: 'Transmit Scales',
      id: 'rewardScale',
      icon: <Hex className="text-reward-scale-0.6 w-5 h-5" />,
    },
    {
      title: 'Earnings',
      id: 'earnings',
      icon: <Hex className="text-earnings-scale-0.9 w-5 h-5" />,
    },
    // {
    //   title: 'Device Usage',
    //   id: 'dc',
    //   icon: <Hex className="text-blue-400 w-5 h-5" />,
    // },
    // {
    //   title: 'Owner',
    //   id: 'owner',
    // },
    // {
    //   title: 'Offline',
    //   id: 'offline',
    // },
  ]

  return (
    <div
      className={classNames(
        'fixed right-0 bottom-8 md:bottom-0 p-4 md:p-8 md:pr-4 transform-gpu transition-all duration-300 ease-in-out',
        {
          'opacity-0 pointer-events-none': !showMapLayers,
        },
      )}
    >
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
          <img alt="" src="/images/close.svg" />
        </div>
        {layers.map(({ title, id, icon }, i) => (
          <Layer
            key={id}
            title={title}
            icon={icon}
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

const Layer = ({ title, onClick, icon, active = false, style }) => (
  <div
    className="flex items-center justify-end space-x-2 cursor-pointer absolute bottom-0 right-0 w-96 transform-gpu transition-transform duration-300 ease-in-out"
    onClick={onClick}
    style={style}
  >
    <span
      className={classNames('text-sm', {
        'text-white font-semibold': active,
        'text-gray-600': !active,
      })}
    >
      {title}
    </span>
    <div
      className={classNames(
        'w-10 h-10 rounded-full mb-1 flex items-center justify-center',
        { 'bg-gray-700': !active, 'bg-gray-200': active },
      )}
    >
      {icon}
    </div>
  </div>
)

export default MapLayersBox
