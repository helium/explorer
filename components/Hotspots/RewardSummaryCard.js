import { Skeleton } from 'antd'

const RewardSummaryCard = ({ timeframe, value, rewardsLoading }) => {
  return (
    <div
      style={{
        backgroundColor: '#f7f7fc',
        borderRadius: '12px',
        minHeight: '92px',
        padding: rewardsLoading ? '0px 12px' : '12px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {rewardsLoading ? (
        <Skeleton active paragraph={{ rows: 1 }} size="small" />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default RewardSummaryCard
