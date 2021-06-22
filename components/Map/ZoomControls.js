import { ZoomControl } from 'react-mapbox-gl'

const ZoomControls = () => {
  return (
    <div className="relative top-14 md:top-20 right-2 md:right-3 zoom-controls">
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
