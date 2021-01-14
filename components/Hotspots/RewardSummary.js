import RewardSummaryCard from './RewardSummaryCard'

const RewardSummary = ({ rewards, rewardsLoading }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '36px 36px 40px 36px',
      }}
    >
      <p style={{ fontFamily: 'soleil', fontSize: '16px', fontWeight: 500 }}>
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
          previousValue={rewards.lastDay}
          percentChange={
            rewards.day === 0 && rewards.lastDay === 0
              ? // if both the period and the previous period rewards were 0, set percent change to 0
                0
              : ((rewards.day - rewards.lastDay) / rewards.lastDay) * 100
          }
          rewardsLoading={rewardsLoading}
        />
        <RewardSummaryCard
          timeframe="7 days"
          value={rewards.week}
          previousValue={rewards.lastWeek}
          percentChange={
            rewards.week === 0 && rewards.lastWeek === 0
              ? 0
              : ((rewards.week - rewards.lastWeek) / rewards.lastWeek) * 100
          }
          rewardsLoading={rewardsLoading}
        />
        <RewardSummaryCard
          timeframe="30 days"
          value={rewards.month}
          previousValue={rewards.lastMonth}
          percentChange={
            rewards.month === 0 && rewards.lastMonth === 0
              ? 0
              : ((rewards.month - rewards.lastMonth) / rewards.lastMonth) * 100
          }
          rewardsLoading={rewardsLoading}
        />
      </div>
    </div>
  )
}

export default RewardSummary
