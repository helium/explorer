import RewardSummaryCard from './RewardSummaryCard'

const RewardSummary = ({ rewards }) => {
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
          value={rewards.day.toFixed(2).toLocaleString()}
        />
        <RewardSummaryCard
          timeframe="7 days"
          value={rewards.week.toFixed(2).toLocaleString()}
        />
        <RewardSummaryCard
          timeframe="30 days"
          value={rewards.month.toFixed(2).toLocaleString()}
        />
      </div>
    </div>
  )
}

export default RewardSummary
