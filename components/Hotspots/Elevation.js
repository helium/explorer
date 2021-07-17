import { Tooltip } from 'antd'

export const formatElevation = (elevation) => {
  return `${elevation} m`
}

const Elevation = ({ hotspot }) => {
  return (
    <Tooltip title="Elevation above ground level">
      <div className="flex items-center space-x-1">
        <span className="ml-1">{formatElevation(hotspot.elevation)}</span>
      </div>
    </Tooltip>
  )
}

export default Elevation
