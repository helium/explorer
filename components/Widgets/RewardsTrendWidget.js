import { useMemo } from 'react'
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { chunk, maxBy, minBy, sumBy, takeRight } from 'lodash'
import classNames from 'classnames'
import { Balance, CurrencyType } from '@helium/currency'

const RewardTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const amount = Balance.fromFloat(
      payload[0].value,
      CurrencyType.networkToken,
    )

    return (
      <div className="bg-white opacity-90 px-2 py-1">
        <p className="text-sm font-sans font-medium text-darkgray-800">
          {amount.toString(2)}
        </p>
      </div>
    )
  }

  return null
}

const RewardsTrendWidget = ({ title, series = [] }) => {
  const [firstValue, lastValue] = useMemo(() => {
    if (series.length <= 30) {
      return [0, sumBy(series, 'total')]
    }
    return chunk(series, 30).map((s) => sumBy(s, 'total'))
  }, [series])

  const chartSeries = useMemo(() => {
    return takeRight(series, 30)
  }, [series])

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
    <div className="bg-gray-200 p-3 rounded-lg col-span-2 flex h-28">
      <div className="w-1/3">
        <div className="text-gray-600 text-sm whitespace-nowrap">{title}</div>
        <div className="text-3xl font-medium my-1.5 tracking-tight">
          {lastValue.toLocaleString()}
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={300} height={100} data={chartSeries}>
            <YAxis hide domain={[yMin, yMax]} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#474DFF"
              strokeWidth={3}
              dot={false}
            />
            <Tooltip content={<RewardTooltip />} />
          </LineChart>
        </ResponsiveContainer>
        <div className="absolute right-4 bottom-0 text-gray-550 text-xs">
          30 Day Trend
        </div>
      </div>
    </div>
  )
}

export default RewardsTrendWidget
