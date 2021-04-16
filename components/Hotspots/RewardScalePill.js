import { Tooltip } from 'antd'
import classNames from 'classnames'
import Hex from '../Hex'
import { generateRewardScaleColor } from './utils'

const RewardScalePill = ({ hotspot, className }) => (
  <Tooltip
    placement="top"
    title={`A Hotspot's own reward scale does not impact its earnings. Hotspots witnessing this Hotspot will see their rewards scaled up or down according to this Hotspot's reward scale.`}
  >
    <div
      className={classNames(
        'inline-flex flex-row items-center justify-center py-0.5 px-2.5 bg-navy-600 rounded-full',
        className,
      )}
    >
      <span className="flex items-center justify-center">
        <Hex
          width={10.5}
          height={12}
          fillColor={generateRewardScaleColor(hotspot.rewardScale)}
        />
      </span>
      <p className="mb-0 text-gray-600 ml-2">
        {hotspot.rewardScale.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  </Tooltip>
)

export default RewardScalePill
