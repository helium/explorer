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
      <div className="reward-summary-card-container">
        <div className="reward-summary-card">
          <p className="reward-summary-card-timeframe">24 hours</p>
          <div className="reward-summary-card-amount-container">
            <span className="reward-summary-number-amount">
              {rewards.day.toFixed(2).toLocaleString()}
            </span>
            <span className="reward-summary-hnt-label">HNT</span>
          </div>
        </div>
        <div className="reward-summary-card">
          <p className="reward-summary-card-timeframe">7 days</p>
          <div className="reward-summary-card-amount-container">
            <span className="reward-summary-number-amount">
              {rewards.week.toFixed(2).toLocaleString()}
            </span>
            <span className="reward-summary-hnt-label">HNT</span>
          </div>
        </div>
        <div className="reward-summary-card">
          <p className="reward-summary-card-timeframe">30 days</p>
          <div className="reward-summary-card-amount-container">
            <span className="reward-summary-number-amount">
              {rewards.month.toFixed(2).toLocaleString()}
            </span>
            <span className="reward-summary-hnt-label">HNT</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardSummary
