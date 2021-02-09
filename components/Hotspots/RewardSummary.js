import RewardSummaryCard from './RewardSummaryCard'
import { calculatePercentChange, formatPercentChangeString } from './utils'
import { Tooltip } from 'antd'
import EarningsChart from './EarningsChart'
import useResponsive from '../AppLayout/useResponsive'

const RewardSummary = ({ rewards, rewardsLoading }) => {
  const { isMobile } = useResponsive()

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: isMobile ? '24px' : '36px 36px 40px 36px',
      }}
    >
      <p style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 500 }}>
        Rewards
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gridAutoRows: 'auto',
          gridGap: '1rem',
        }}
      >
        <RewardSummaryCard
          timeframe="24 hours"
          value={rewards.day}
          previousValue={rewards.previousDay}
          percentChange={calculatePercentChange(
            rewards.day,
            rewards.previousDay,
          )}
          rewardsLoading={rewardsLoading}
        />
        <RewardSummaryCard
          timeframe="7 days"
          value={rewards.week}
          previousValue={rewards.previousWeek}
          percentChange={calculatePercentChange(
            rewards.week,
            rewards.previousWeek,
          )}
          rewardsLoading={rewardsLoading}
        />
      </div>
      <div style={{ maxWidth: 850 + 40, margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#F6F7FC',
            borderRadius: 14,
            marginTop: 20,
            padding: 32,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
          }}
        >
          {!rewardsLoading && (
            <>
              <div>
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
                    30 DAYS
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      color: '#262625',
                      fontWeight: 300,
                      fontSize: '46px',
                    }}
                  >
                    {rewards.month.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span style={{ fontSize: '14px', marginLeft: '4px' }}>
                    HNT
                  </span>
                </div>
                <Tooltip
                  title={`Previous 30 days: ${rewards.previousMonth} HNT`}
                  placement={'bottom'}
                >
                  <div
                    style={{
                      borderRadius: 7,
                      color:
                        calculatePercentChange(
                          rewards.month,
                          rewards.previousMonth,
                        ) > 0
                          ? '#29D391'
                          : '#474DFF',
                      padding: 8,
                      marginTop: 30,
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
                      {formatPercentChangeString(
                        calculatePercentChange(
                          rewards.month,
                          rewards.previousMonth,
                        ),
                      )}
                    </span>
                  </div>
                </Tooltip>
              </div>
              <div
                style={{
                  width: '100%',
                  padding: isMobile ? '24px 0 0 0' : '0 0 0 24px',
                }}
              >
                <EarningsChart
                  rewardsLoading={rewardsLoading}
                  rewards={rewards}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RewardSummary
