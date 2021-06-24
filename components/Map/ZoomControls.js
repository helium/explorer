import classNames from 'classnames'
import { ZoomControl } from 'react-mapbox-gl'
import useInfoBox from '../../hooks/useInfoBox'

const ZoomControls = () => {
  const { showInfoBox } = useInfoBox()

  return (
    <div
      className={classNames(
        'md:flex relative top-14 md:top-20 right-2 md:right-3 zoom-controls transition-all md:pointer-events-auto md:opacity-100',
        { 'opacity-0 pointer-events-none': showInfoBox },
      )}
    >
      <ZoomControl
        style={{
          boxShadow: 'none',
          inset: 'none',
          border: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default ZoomControls
