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
      title="Transmit Scale"
      tooltip={
        <>
          <div>
            Transmit scale is a multiplier that is applied to rewards of any
            Hotspots that witness you. The scale also affects how many rewards
            you receive as a Challengee.
          </div>
          <div style={{ marginTop: '10px' }}>
            Low Transmit scale does not mean your Hotspot earnings will be low.
            Make sure you have a great setup so you can witness Hotspots with
            1.0 Transmit scales.
          </div>
        </>
      }
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
