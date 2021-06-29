import classNames from 'classnames'
import { useCallback } from 'react'
import useMeasuringTool from '../../hooks/useMeasuringTool'
import { haversineDistance } from '../../utils/location'
import { formatDistance } from '../Hotspots/utils'

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
        <svg
          className={classNames('w-5 h-5 stroke-current', {
            'text-white': measuring,
            'text-black': !measuring,
          })}
          width="42"
          height="31"
          viewBox="0 0 42 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.897 19.025L18.8644 12.0403M22.897 19.025L31.1649 14.2515M22.897 19.025L14.6291 23.7984M31.1649 14.2515L39.4328 9.47801L35.4002 2.49332M31.1649 14.2515L29.1323 10.7309M14.6291 23.7984L6.36123 28.5719L2.32861 21.5872M14.6291 23.7984L12.5965 20.2778"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      {measuring && (
        <div className="absolute right-10 mr-2 top-2">
          <span className="text-white font-sans text-sm whitespace-nowrap">
            {generateMeasurementString(measurementStart, measurementEnd)}
          </span>
        </div>
      )}
    </div>
  )
}

export default MeasuringToolButton
