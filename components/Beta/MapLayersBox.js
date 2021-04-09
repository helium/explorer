import classNames from 'classnames'
import Image from 'next/image'
import { useCallback } from 'react'

const Layer = ({ title, onClick }) => (
  <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
    <div className="bg-gray-500 w-20 h-20 rounded-xl mb-1" />
    <span className="text-sm text-gray-800">{title}</span>
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
      if (layer !== null) {
        setLayer(null)
        return
      }

      setLayer(clickedLayer)
    },
    [layer, setLayer],
  )

  return (
    <div
      className={classNames('fixed bottom-0 bg-white w-full p-4', {
        hidden: !showMapLayers,
      })}
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
      <div className="grid grid-flow-col">
        <Layer title="New Hotspots" onClick={handleClick('offline')} />
        <Layer title="Reward Scales" onClick={handleClick('offline')} />
        <Layer title="Offline" onClick={handleClick('offline')} />
      </div>
    </div>
  )
}

export default MapLayersBox
