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
          previousValue={rewards.previousDay}
          percentChange={
            rewards.day === 0 && rewards.previousDay === 0
              ? // if both the period and the previous period rewards were 0, set percent change to 0
                0
              : ((rewards.day - rewards.previousDay) / rewards.previousDay) *
                100
          }
          rewardsLoading={rewardsLoading}
        />
        <RewardSummaryCard
          timeframe="7 days"
          value={rewards.week}
          previousValue={rewards.previousWeek}
          percentChange={
            rewards.week === 0 && rewards.previousWeek === 0
              ? 0
              : ((rewards.week - rewards.previousWeek) / rewards.previousWeek) *
                100
          }
          rewardsLoading={rewardsLoading}
        />
        <RewardSummaryCard
          timeframe="30 days"
          value={rewards.month}
          previousValue={rewards.previousMonth}
          percentChange={
            rewards.month === 0 && rewards.previousMonth === 0
              ? 0
              : ((rewards.month - rewards.previousMonth) /
                  rewards.previousMonth) *
                100
          }
          rewardsLoading={rewardsLoading}
        />
      </div>
    </div>
  )
}

export default RewardSummary
