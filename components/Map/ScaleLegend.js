import { ScaleControl } from 'react-mapbox-gl'
import classNames from 'classnames'
import useMapLayer from '../../hooks/useMapLayer'

const ScaleLegend = ({ className }) => {
  const { showMapLayers, mapLayer } = useMapLayer()
  return (
    <div className="pointer-events-none w-full h-screen absolute right-0 bottom-0">
      <div
        className={classNames('w-full absolute right-0 bottom-0', className, {
          'hidden pointer-events-none': showMapLayers,
          'mb-20 mr-14 md:mb-16 md:mr-20':
            mapLayer === 'rewardScale' ||
            mapLayer === 'earnings' ||
            mapLayer === 'dc',
          'mb-8 mr-12 md:mb-5':
            mapLayer !== 'rewardScale' &&
            mapLayer !== 'earnings' &&
            mapLayer !== 'dc',
        })}
      >
        <ScaleControl
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            fontFamily: 'Inter',
            fontSize: 14,
            boxShadow: 'none',
            border: 'none',
          }}
        />
      </div>
    </div>
  )
}

export default ScaleLegend
