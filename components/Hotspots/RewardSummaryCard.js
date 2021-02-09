import { Tooltip, Skeleton } from 'antd'
import { formatPercentChangeString } from './utils'

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

  const percentChangeString = formatPercentChangeString(percentChange)

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
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
            <Tooltip
              title={`Previous ${timeframe}: ${previousValueString} HNT`}
            >
              <div
                style={{
                  borderRadius: 5,
                  marginLeft: 10,
                  display: 'inline',
                  height: 'auto',
                }}
              >
                <span
                  style={{
                    color: percentChange > 0 ? '#32C48D' : '#474DFF',
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
          <div>
            <span
              style={{
                color: '#262625',
                fontWeight: 400,
                fontSize: '32px',
              }}
            >
              {valueString}
            </span>
            <span style={{ fontSize: '12px', marginLeft: '4px' }}>HNT</span>
          </div>
        </>
      )}
    </div>
  )
}

export default RewardSummaryCard
