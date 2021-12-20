import { useMemo } from 'react'
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { chunk, maxBy, minBy, sumBy, takeRight } from 'lodash'
import classNames from 'classnames'
import { Balance, CurrencyType } from '@helium/currency'
import LargeBalance from '../Common/LargeBalance'
import Currency from '../Common/Currency'
import { formatHoursRange, formatDaysRange } from '../Hotspots/utils'
import Skeleton from '../Common/Skeleton'
import { useMarket } from '../../data/market'

const RewardTooltip = ({
  active,
  payload,
  showTarget = false,
  dataPointTimePeriod,
}) => {
  if (active && payload && payload.length) {
    let amount
    let target

    if (showTarget) {
      amount = Balance.fromFloat(payload[1].value, CurrencyType.networkToken)
      target = Balance.fromFloat(payload[0].value, CurrencyType.networkToken)
    } else {
      amount = Balance.fromFloat(payload[0].value, CurrencyType.networkToken)
    }

    return (
      <div className="bg-white bg-opacity-95 px-2 py-1 rounded-md shadow-md z-50">
        {payload[0] && (
          <div className="text-xs font-sans font-light text-gray-800">
            {dataPointTimePeriod === 'hour'
              ? formatHoursRange(payload[0].payload.timestamp)
              : formatDaysRange(payload[0].payload.timestamp)}
          </div>
        )}
        <div className="text-md font-sans font-semibold text-navy-400">
          {showTarget ? 'Amount: ' : ''}
          {amount.toString(2)}
        </div>
        {showTarget && (
          <div className="text-sm font-sans font-medium text-darkgray-800">
            Target: {target.toString(2)}
          </div>
        )}
      </div>
    )
  }

  return null
}

const RewardsTrendWidget = ({
  title,
  periodSelector,
  series = [],
  isLoading,
  showTarget = false,
  dataPointTimePeriod = 'day',
  periodLabel,
  periodLength,
}) => {
  const { market } = useMarket()

  const DATA_POINTS_TO_SHOW = periodLength ? periodLength : 30

  const [firstValue, lastValue] = useMemo(() => {
    if (series.length <= DATA_POINTS_TO_SHOW) {
      return [0, sumBy(series, 'total')]
    }
    return chunk(series, DATA_POINTS_TO_SHOW).map((s) => sumBy(s, 'total'))
  }, [DATA_POINTS_TO_SHOW, series])

  const chartSeries = useMemo(() => {
    return takeRight(series, DATA_POINTS_TO_SHOW)
  }, [DATA_POINTS_TO_SHOW, series])

  const [yMin, yMax] = useMemo(() => {
    return [
      minBy(chartSeries, 'total')?.total || 0,
      maxBy(chartSeries, 'total')?.total || 0,
    ]
  }, [chartSeries])

  const change = useMemo(() => {
    return (lastValue - firstValue) / firstValue
  }, [firstValue, lastValue])

  return (
    <div className="bg-gray-200 p-3 rounded-lg flex flex-col col-span-2">
      <div
        className={classNames('flex', {
          'h-28': !periodSelector,
          'h-24': periodSelector,
        })}
      >
        <div className="w-1/3">
          <div className="text-gray-600 text-sm whitespace-nowrap">{title}</div>
          <div className="text-3xl font-medium mt-1.5 tracking-tight">
            {isLoading ? <Skeleton /> : <LargeBalance value={lastValue} />}
          </div>

          <div className="text-base text-gray-600 mb-1 tracking-tight w-full break-all">
            {isLoading || !market ? (
              <Skeleton className="w-1/3 my-2" />
            ) : (
              <Currency value={lastValue * market?.price} isLarge />
            )}
          </div>
          {firstValue > 0 && (
            <div
              className={classNames('text-sm font-medium', {
                'text-green-500': change > 0,
                'text-navy-400': change < 0,
              })}
            >
              {change > 0 ? '+' : ''}
              {change.toLocaleString(undefined, {
                style: 'percent',
                maximumFractionDigits: 3,
              })}
            </div>
          )}
        </div>
        <div className="w-full p-4 pr-0 relative">
          <ResponsiveContainer width="99%" aspect={4} height="100%">
            <LineChart width={300} height={100} data={chartSeries}>
              <YAxis hide domain={[yMin, yMax]} />
              {showTarget && (
                <Line
                  type="step"
                  dataKey="target"
                  stroke="#D2D6DC"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="total"
                stroke="#474DFF"
                strokeWidth={3}
                dot={false}
              />
              <Tooltip
                content={
                  <RewardTooltip
                    showTarget={showTarget}
                    dataPointTimePeriod={dataPointTimePeriod}
                  />
                }
              />
            </LineChart>
          </ResponsiveContainer>
          {periodLabel && (
            <div className="absolute right-4 bottom-0 text-gray-550 text-xs z-10">
              {periodLabel}
            </div>
          )}
        </div>
      </div>
      {periodSelector}
    </div>
  )
}

export default RewardsTrendWidget
