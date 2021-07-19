import Hex from '../Hex'
import { generateRewardScaleColor } from './utils'

export const formatElevation = (elevation) => {
  return `${elevation} m`
}

const TransmitScale = ({ hotspot }) => {
  if (!hotspot.rewardScale) return null

  return (
    <span className="flex items-center">
      <Hex
        width={10}
        height={12}
        fillColor={generateRewardScaleColor(hotspot?.rewardScale)}
      />
      <span className="ml-1">{hotspot?.rewardScale?.toFixed(2)}</span>
    </span>
  )
}

export default TransmitScale
