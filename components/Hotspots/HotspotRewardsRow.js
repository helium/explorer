import { Tooltip, Skeleton } from 'antd'
import round from 'lodash/round'
import { calculatePercentChange, formatPercentChangeString } from './utils'

const HotspotRewardsRow = ({ rewardsLoading, data, period }) => {
  if (rewardsLoading) {
    return (
      <span className="inline-skeleton-override">
        <Skeleton active paragraph={{ rows: 0 }} size="small" />
      </span>
    )
  } else {
    let currentPeriod = 0
    let previousPeriod = 0

    if (period === 'day') {
      currentPeriod = data.day
      previousPeriod = data.previousDay
    } else if (period === 'week') {
      currentPeriod = data.week
      previousPeriod = data.previousWeek
    } else if (period === 'month') {
      currentPeriod = data.month
      previousPeriod = data.previousMonth
    }

    const percentChange = calculatePercentChange(currentPeriod, previousPeriod)

    return (
      <span>
        {round(currentPeriod, 2)}
        <Tooltip title={`Previous ${period}: ${round(previousPeriod, 2)} HNT`}>
          <span
            style={{
              marginLeft: 4,
              fontSize: 10,
              color: percentChange > 0 ? '#32C48D' : '#CA0926',
            }}
          >
            {formatPercentChangeString(percentChange)}
          </span>
        </Tooltip>
      </span>
    )
  }
}

export default HotspotRewardsRow
