import classNames from 'classnames'
import Image from 'next/image'
import { useCallback } from 'react'

const Layer = ({ title, onClick, active = false }) => (
  <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
    <div className="bg-gray-500 w-20 h-20 rounded-xl mb-1" />
    <span
      className={classNames('text-sm', {
        'text-navy-400 font-semibold': active,
        'text-gray-800': !active,
      })}
    >
      {title}
    </span>
  </div>
)

const MapLayersBox = ({
  showMapLayers,
  toggleShowMapLayers,
  layer,
  setLayer,
}) => {
  const handleClick = useCallback(
    (clickedLayer) => () => {
      if (layer === clickedLayer) {
        setLayer(null)
        return
      }

      setLayer(clickedLayer)
    },
    [layer, setLayer],
  )

  return (
    <div
      className={classNames(
        'fixed bottom-0 bg-white w-full p-4 z-10 transform-gpu transition-transform duration-300 ease-in-out',
        {
          'translate-y-96': !showMapLayers,
        },
      )}
    >
      <div className="absolute flex justify-end w-full -top-14 left-0 px-4 md:px-0">
        <div
          className="md:hidden transform rotate-180"
          onClick={toggleShowMapLayers}
        >
          <Image src="/images/circle-arrow.svg" width={35} height={35} />
        </div>
      </div>
      <div className="text-base font-medium mb-3">Map Layers</div>
      <div className="grid grid-cols-3 gap-4 md:grid-flow-col md:auto-cols-fr">
        <Layer
          title="New Hotspots"
          onClick={handleClick('added')}
          active={layer === 'added'}
        />
        <Layer
          title="Reward Scales"
          onClick={handleClick('rewardScale')}
          active={layer === 'rewardScale'}
        />
        <Layer
          title="Owner"
          onClick={handleClick('owner')}
          active={layer === 'owner'}
        />
        <Layer
          title="Offline"
          onClick={handleClick('offline')}
          active={layer === 'offline'}
        />
      </div>
    </div>
  )
}

export default MapLayersBox
