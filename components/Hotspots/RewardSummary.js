import RewardSummaryCard from './RewardSummaryCard'
import { calculatePercentChange } from './utils'
import EarningsChart from './EarningsChart'

const RewardSummary = ({ rewards, rewardsLoading }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '36px 36px 40px 36px',
      }}
    >
      <p style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 500 }}>
        Rewards
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gridAutoRows: 'auto',
          gridGap: '1rem',
        }}
      >
        <RewardSummaryCard
          timeframe="24 hours"
          value={rewards.day}
          previousValue={rewards.previousDay}
          percentChange={calculatePercentChange(
            rewards.day,
            rewards.previousDay,
          )}
          rewardsLoading={rewardsLoading}
        />
        <RewardSummaryCard
          timeframe="7 days"
          value={rewards.week}
          previousValue={rewards.previousWeek}
          percentChange={calculatePercentChange(
            rewards.week,
            rewards.previousWeek,
          )}
          rewardsLoading={rewardsLoading}
        />
        <RewardSummaryCard
          timeframe="30 days"
          value={rewards.month}
          previousValue={rewards.previousMonth}
          percentChange={calculatePercentChange(
            rewards.month,
            rewards.previousMonth,
          )}
          rewardsLoading={rewardsLoading}
        />
      </div>
      <div style={{ maxWidth: 850 + 40, margin: '0 auto', paddingBottom: 50 }}>
        <EarningsChart rewardsLoading={rewardsLoading} rewards={rewards} />
      </div>
    </div>
  )
}

export default RewardSummary
