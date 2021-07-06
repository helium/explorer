import classNames from 'classnames'
import { useCallback } from 'react'
import useMeasuringTool from '../../hooks/useMeasuringTool'
import { haversineDistance } from '../../utils/location'
import { formatDistance } from '../Hotspots/utils'
import MeasuringIcon from '../Icons/MeasuringIcon'

const MeasuringToolButton = () => {
  const {
    measuring,
    measurementStart,
    measurementEnd,
    toggleMeasuring,
  } = useMeasuringTool()

  const generateMeasurementString = useCallback(() => {
    if (measurementStart && measurementEnd) {
      return formatDistance(
        haversineDistance(
          measurementStart['lng'],
          measurementStart['lat'],
          measurementEnd['lng'],
          measurementEnd['lat'],
        ) * 1000,
      )
    } else if (!measurementStart && !measurementEnd) {
      return 'Place first point'
    } else if (measurementStart && !measurementEnd) {
      return 'Place second point'
    }
  }, [measurementEnd, measurementStart])

  return (
    <div className="relative">
      <div
        className={classNames(
          'cursor-pointer w-10 h-10 rounded-full flex items-center justify-center shadow-md',
          { 'bg-white': !measuring, 'bg-navy-400': measuring },
        )}
        onClick={toggleMeasuring}
      >
        <MeasuringIcon className="w-5 h-5" active={measuring} />
      </div>
      {measuring && (
        <div className="absolute right-10 mr-2 top-2">
          <span className="text-white font-sans font-semibold text-sm whitespace-nowrap p-1 rounded-md measuring-helptext-blur">
            {generateMeasurementString(measurementStart, measurementEnd)}
          </span>
        </div>
      )}
    </div>
  )
}

export default MeasuringToolButton
