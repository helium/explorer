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
}) => {
  const chartPercentChange = calculatePercentChange(value, previousValue)

  return (
    <div>
      <div style={{ maxWidth: 850 + 40, margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#F6F7FC',
            borderRadius: 14,
            marginTop: 20,
            padding: 32,
            justifyContent: 'space-between',
          }}
          className="earnings-chart-container"
        >
          {!rewardsLoading && (
            <>
              <div style={{}}>
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
                </div>
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
              <div className="earnings-chart-content">
                <EarningsChart
                  buckets={scale === 'hours' ? buckets.hours : buckets.days}
                  valueLoading={rewardsLoading}
                  value={value}
                  slices={slices}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RewardSummaryCard
