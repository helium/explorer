const RewardSummaryCard = ({ timeframe, value }) => {
  return (
    <div
      style={{
        backgroundColor: '#f7f7fc',
        borderRadius: '12px',
        minHeight: '78px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <p
        style={{
          margin: 0,
          textTransform: 'uppercase',
          fontSize: '12px',
          color: '#6d6ea0',
        }}
      >
        {timeframe}
      </p>
      <div>
        <span
          style={{
            fontFamily: 'soleil',
            color: '#262625',
            fontWeight: 400,
            fontSize: '32px',
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: '12px', marginLeft: '4px' }}>HNT</span>
      </div>
    </div>
  )
}

export default RewardSummaryCard
