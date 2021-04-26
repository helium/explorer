import Widget from './Widget'
import Hex from '../Hex'
import { generateRewardScaleColor } from '../Hotspots/utils'

const RewardScaleWidget = ({ hotspot }) => {
  const { rewardScale } = hotspot
  const valueString = rewardScale
    ? rewardScale.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : 'N/A'
  return (
    <Widget
      title="Reward Scaling"
      value={valueString}
      icon={
        <Hex
          width={21}
          height={24}
          fillColor={
            rewardScale ? generateRewardScaleColor(rewardScale) : '#aaa'
          }
        />
      }
      subtitle={<span className="text-gray-550">No Change</span>}
    />
  )
}

export default RewardScaleWidget
