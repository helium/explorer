import { Tooltip, Skeleton } from 'antd'
import { calculatePercentChange, formatPercentChangeString } from './utils'
import EarningsChart from './EarningsChart'

const RewardSummaryCard = ({
  timeframeString,
  value,
  buckets,
  scale,
  previousValue,
  rewardsLoading,
  slices,
  width,
}) => {
  let chartPercentChange
  if (previousValue !== undefined && previousValue !== 0)
    chartPercentChange = calculatePercentChange(value, previousValue)

  return (
    <div>
      <div style={{ maxWidth: 850 + 40, margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#F6F7FC',
            borderRadius: 14,
            padding: 32,
            justifyContent: 'space-between',
          }}
          className="earnings-chart-container"
        >
          <>
            <div>
              <div style={{ paddingBottom: 8 }}>
                <p
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    color: '#6d6ea0',
                    margin: 0,
                  }}
                >
                  {timeframeString}
                </p>
                {!rewardsLoading ? (
                  <>
                    <span
                      style={{
                        color: '#262625',
                        fontWeight: 300,
                        fontSize: '46px',
                      }}
                    >
                      {value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span style={{ fontSize: '14px', marginLeft: '4px' }}>
                      HNT
                    </span>
                  </>
                ) : (
                  <Skeleton active paragraph={{ rows: 1 }} size="large" />
                )}
              </div>
              {previousValue !== undefined &&
                previousValue !== 0 &&
                !rewardsLoading && (
                  <Tooltip
                    title={`Previous period: ${previousValue} HNT`}
                    placement={'bottom'}
                  >
                    {chartPercentChange !== 0 && (
                      <div
                        style={{
                          borderRadius: 7,
                          backgroundColor:
                            chartPercentChange > 0 ? '#29D391' : '#474DFF',
                          padding: '4px 8px',
                          display: 'inline',
                          height: 'auto',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            color: 'white',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatPercentChangeString(chartPercentChange)}
                        </span>
                      </div>
                    )}
                  </Tooltip>
                )}
            </div>
            <div className="earnings-chart-content">
              {!rewardsLoading ? (
                <EarningsChart
                  buckets={
                    scale === 'hours'
                      ? buckets.hours
                      : scale === 'year'
                      ? buckets
                      : buckets.days
                  }
                  scale={scale}
                  loading={rewardsLoading}
                  width={width}
                  slices={slices}
                />
              ) : (
                <Skeleton
                  title={false}
                  active
                  paragraph={{ rows: 2 }}
                  size="large"
                />
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  )
}

export default RewardSummaryCard
