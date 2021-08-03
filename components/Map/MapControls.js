import classNames from 'classnames'
import Image from 'next/image'
import useInfoBox from '../../hooks/useInfoBox'
import useMapLayer from '../../hooks/useMapLayer'
import MapLocationButton from './MapLocationButton'
import MeasuringToolButton from './MeasuringToolButton'

const MapControls = () => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()
  const { showMapLayers, toggleMapLayers, mapLayer } = useMapLayer()

  return (
    <>
      <div
        className={classNames(
          'fixed right-0 bottom-8 md:bottom-0 p-4 md:p-8 md:pr-4 grid-flow-row gap-3 transform-gpu transition-transform duration-300 ease-in-out',
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
        <MeasuringToolButton />
        <MapLocationButton />
        <div
          className="cursor-pointer bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          onClick={toggleMapLayers}
        >
          <Image src="/images/layer.svg" width={20} height={20} />
        </div>
      </div>
      <div
        className={classNames(
          'fixed bottom-10 md:bottom-7 right-14 px-4 md:px-8 py-1 md:py-0.5 w-3/4 max-w-xs md:max-w-sm transform-gpu transition-all duration-300 ease-in-out',
          {
            'opacity-100 pointer-events-auto':
              mapLayer === 'rewardScale' && !showMapLayers,
            'opacity-0 pointer-events-none translate-y-10':
              mapLayer !== 'rewardScale' || showMapLayers,
          },
        )}
      >
        <div className="rounded-lg flex flex-row items-center justify-between titlebox-blur">
          <a
            href="https://docs.helium.com/wallets/app-wallet/hexagons/#transmit-scale"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-white font-sans text-sm pl-2 pr-2 md:pr-8 whitespace-nowrap">
              Transmit Scale
            </span>
          </a>
          <div className="flex flex-col p-2 pb-1 w-full">
            <div className="bg-gradient-to-r from-reward-scale-0 via-reward-scale-0.6 to-reward-scale-1 rounded-full h-2.5 w-full" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-white text-xs font-sans">0</span>
              <span className="text-white text-xs font-sans">0.5</span>
              <span className="text-white text-xs font-sans">1</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          'fixed bottom-10 md:bottom-7 right-14 px-4 md:px-8 py-1 md:py-0.5 w-3/4 max-w-xs md:max-w-sm transform-gpu transition-all duration-300 ease-in-out',
          {
            'opacity-100 pointer-events-auto':
              mapLayer === 'dc' && !showMapLayers,
            'opacity-0 pointer-events-none translate-y-10':
              mapLayer !== 'dc' || showMapLayers,
          },
        )}
      >
        <div className="rounded-lg flex flex-row items-center justify-between titlebox-blur">
          <a
            href="https://docs.helium.com/use-the-network/console/data-credits/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-white font-sans text-sm pl-2 pr-2 md:pr-8 whitespace-nowrap">
              Device Usage
            </span>
          </a>
          <div className="flex flex-col p-2 pb-1 w-full">
            <div className="bg-gradient-to-r from-transparent to-blue-400 rounded-full h-2.5 w-full" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-white text-xs font-sans">0 DC</span>
              <span className="text-white text-xs font-sans">100+ DC</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MapControls
