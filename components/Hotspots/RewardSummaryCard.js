import { Tooltip, Skeleton } from 'antd'

const RewardSummaryCard = ({
  timeframe,
  value,
  previousValue,
  rewardsLoading,
  percentChange,
}) => {
  const valueString = value?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const previousValueString = previousValue?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const percentChangeString =
    percentChange === 0
      ? // if there wasn't a percentage change (both value and previousValue are 0), don't show the indicator
        ''
      : `${percentChange > 0 ? '+' : ''}${percentChange?.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}%`

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
              {valueString}
            </span>
            <span style={{ fontSize: '12px', marginLeft: '4px' }}>HNT</span>
            <Tooltip title={`Previous ${timeframe}: ${previousValueString}`}>
              <div
                style={{
                  borderRadius: 5,
                  marginLeft: 10,
                  padding: '5px 8px',
                  display: 'inline',
                  height: 'auto',
                }}
              >
                <span
                  style={{
                    fontFamily: 'soleil',
                    color: percentChange >= 0 ? '#32C48D' : '#CA0926',
                    fontWeight: 400,
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {percentChangeString}
                </span>
              </div>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  )
}

export default RewardSummaryCard
