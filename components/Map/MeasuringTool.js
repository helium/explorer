import classNames from 'classnames'
import { useState } from 'react'
import { useCallback } from 'react'

const MeasuringToolButton = ({ handleClick, active }) => {
  return (
    <div
      className={classNames(
        'cursor-pointer  w-10 h-10 rounded-full flex items-center justify-center shadow-md',
        { 'bg-white': !active, 'bg-navy-400': active },
      )}
      onClick={handleClick}
    >
      <img src="/images/ruler-temp.svg" className="w-5 h-5" />
    </div>
  )
}

const MeasuringTool = () => {
  const [isMeasuring, setIsMeasuring] = useState(false)

  const handleMeasureClick = useCallback(() => {
    setIsMeasuring((prevState) => !prevState)
    // Logic for first click, second click, third click
  }, [])

  return (
    <>
      <MeasuringToolButton
        handleClick={handleMeasureClick}
        active={isMeasuring}
      />
      {/* Points on map */}
    </>
  )
}

export default MeasuringTool
