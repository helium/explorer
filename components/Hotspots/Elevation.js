import { Tooltip } from 'antd'

export const formatElevation = (elevation) => {
  return `${elevation} m`
}

const Elevation = ({ hotspot, icon = true }) => {
  return (
    <Tooltip title="Elevation above ground level">
      <div className="flex items-center space-x-1">
        {icon && <img src="/images/elevation.svg" className="h-4" />}
        <span>{formatElevation(hotspot.elevation)}</span>
      </div>
    </Tooltip>
  )
}

export default Elevation
