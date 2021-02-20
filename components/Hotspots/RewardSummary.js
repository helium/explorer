import RewardSummaryCard from './RewardSummaryCard'
import { calculatePercentChange, formatPercentChangeString } from './utils'
import { Tooltip } from 'antd'
import EarningsChart from './EarningsChart'

const RewardSummary = ({ rewards, rewardsLoading }) => {
  return (
    <div
      className="earnings-chart-period-container"
      style={{
        backgroundColor: 'white',
      }}
    >
      <p style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 500 }}>
        Rewards
      </p>
      <RewardSummaryCard
        value={rewards.day}
        buckets={rewards.buckets}
        previousValue={rewards.previousDay}
        rewardsLoading={rewardsLoading}
        timeframeString="24 Hour"
        scale="hours"
        slices={24}
      />
      <RewardSummaryCard
        value={rewards.week}
        buckets={rewards.buckets}
        previousValue={rewards.previousWeek}
        rewardsLoading={rewardsLoading}
        timeframeString="7 Day"
        scale="days"
        slices={7}
      />
      <RewardSummaryCard
        value={rewards.month}
        buckets={rewards.buckets}
        previousValue={rewards.previousMonth}
        rewardsLoading={rewardsLoading}
        timeframeString="30 Day"
        scale="days"
        slices={30}
      />
    </div>
  )
}

export default RewardSummary
