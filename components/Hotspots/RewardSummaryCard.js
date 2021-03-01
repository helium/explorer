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
        <div className="earnings-chart-container">
          <>
            <div>
              <div style={{ paddingBottom: 8 }} className="flexwhensm">
                <p className="summarycardheader">{timeframeString}</p>
                {!rewardsLoading ? (
                  <>
                    <span className="summarycardmaintitle">
                      {value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span style={{ fontSize: '14px', marginLeft: '4px' }}>
                        HNT
                      </span>
                    </span>
                  </>
                ) : (
                  <Skeleton active paragraph={{ rows: 0 }} size="large" />
                )}
              </div>

              {previousValue !== undefined &&
                previousValue !== 0 &&
                !rewardsLoading && (
                  <div className="hidden-xs">
                    <Skeleton active paragraph={{ rows: 0 }} size="large" />

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
                  </div>
                )}
            </div>
            <div className="earnings-chart-content hidden-xs">
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
